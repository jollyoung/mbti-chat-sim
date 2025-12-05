import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { SCENE } from "../constants/sceneIDs";
import { LOCATION } from "../constants/locations";

// 시나리오 테이블
import INFP from "../stories/INFP";
import INFJ from "../stories/INFJ";
import INTJ from "../stories/INTJ";
import ISFP from "../stories/ISFP";
import ESTJ from "../stories/ESTJ";
import ENTP from "../stories/ENTP";
import ENTJ from "../stories/ENTJ";
import ESFP from "../stories/ESFP";
import ENFP from "../stories/ENFP";
import ISFJ from "../stories/ISFJ";
import ISTP from "../stories/ISTP";
import ISTJ from "../stories/ISTJ";

// 세션 ID 생성
const createSessionId = () => {
  const prefix = "session-";
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `${prefix}${timestamp}-${randomPart}`;
};

const SPEECH_DELAY_MS = 1000;

export function useStoryEngine() {
  const [currentScenario, setCurrentScenario] = useState(null);
  const [currentScene, setCurrentScene] = useState(SCENE.CONTACT_DECISION);
  const [history, setHistory] = useState([]);
  const [pendingChoice, setPendingChoice] = useState(null);
  const [currentMBTI, setCurrentMBTI] = useState(null);
  const userInfoRef = useRef(null);
  const [isEnding, setIsEnding] = useState(false);
  const [engineError, setEngineError] = useState("");
  const [currentLocation, setCurrentLocation] = useState("default");
  const [locationVersion, setLocationVersion] = useState(0);
  const mbtiRef = useRef(null);

  // 애정도 상태
  const [affection, setAffection] = useState(0);

  const sessionIdRef = useRef(createSessionId());
  const stepRef = useRef(0);
  const abortRef = useRef(false);

  const storyTable = {
    INFP,
    INFJ,
    INTJ,
    ISFP,
    ESTJ,
    ENTP,
    ENTJ,
    ESFP,
    ENFP,
    ISFJ,
    ISTP,
    ISTJ,
  };

  const runScene = async (scenario, sceneName) => {
    if (!scenario || !scenario[sceneName]) {
      setEngineError(`시나리오 테이블에 '${sceneName}' 장면이 없습니다.`);
      return;
    }

    const sceneArr = scenario[sceneName];

    const sceneLocation = sceneArr[0]?.location;

    if (sceneLocation && sceneLocation !== currentLocation) {
      setHistory([]);                 // 대화 기록 초기화
      setCurrentLocation(sceneLocation);
      setLocationVersion((v) => v + 1);
    }

    if (sceneLocation) {
      const isLocationChanged = sceneLocation !== currentLocation;

      if (isLocationChanged) {
        setHistory([]);                
        setCurrentLocation(sceneLocation);
        setLocationVersion((v) => v + 1); 
      } else {
        setCurrentLocation(sceneLocation);
      }
    }

    for (const item of sceneArr) {
      if (abortRef.current) return;

      const isNpc = item.role === "npc";
      const isPlayer = item.role === "player";

      /** NPC/Player 대화 추가 */
      if (isNpc || isPlayer) {
        const messageDelay = item.delay ?? SPEECH_DELAY_MS;
        await new Promise((resolve) => setTimeout(resolve, messageDelay));
        setHistory((prev) => [...prev, item]);
        continue;
      }

      /** 종료 처리 */
      if (item.type === "end") {
        setHistory(prev => [...prev, item]);  // 종료 대화 추가

        if (!abortRef.current && sessionIdRef.current) {
          setTimeout(() => {
            setIsEnding(true); // 애정도 최대치 도달 시 종료 처리
          }, 3000);
        }
        return;
      }

      /** 선택지 처리 */
      if (item.type === "choice") {
        await new Promise((resolve) => setTimeout(resolve, 600));
        setPendingChoice(item);
        continue;
      }
    }
  };

  const choose = async (option) => {
    if (abortRef.current) return;

    const activeSessionId = sessionIdRef.current;
    setPendingChoice(null);

    // 사용자 선택 기록 추가
    setHistory((prev) => [
      ...prev,
      { role: "user", text: option.label || "사용자 선택" },
    ]);

    // 사용자 선택 로그 전송
    stepRef.current += 1;
    await axios.post("/api/logChoice", {
      sessionId: activeSessionId,
      step: stepRef.current,
      mbti: currentMBTI,
      scene: currentScene,
      userChoice: option.label,
      tone: option.tone || "",
      intent: option.intent || "",
      timestamp: Date.now(),
      sex: userInfoRef.current?.sex || "",   // 성별
      age: userInfoRef.current?.age || "",   // 나이
    });

    // 애정도 상태 업데이트
    let updatedAffection = affection;
    if (typeof option.affection === "number") {
      updatedAffection = affection + option.affection;
      setAffection((prev) => prev + option.affection);
    }

    /** 종료 조건 체크 */
    if (option.next === "CHECK_END") {
      let targetScene = "end_D";

      if (updatedAffection >= 10) targetScene = "end_A";
      else if (updatedAffection >= 5) targetScene = "end_B";
      else if (updatedAffection >= 1) targetScene = "end_C";

      console.log("ENDING LOG PAYLOAD", {
        sessionId: activeSessionId,
        mbti: mbtiRef.current,
        endedAt: Date.now(),
      });

      await axios.post("/api/logSession", {
        sessionId: activeSessionId,
        mbti: mbtiRef.current,
        sex: userInfoRef.current?.sex || "",
        age: userInfoRef.current?.age || "",
        endedAt: Date.now(),
      });


      if (!abortRef.current && sessionIdRef.current === activeSessionId) {
        setCurrentScene(targetScene);
        runScene(currentScenario, targetScene);
      }
      return;
    }

    /** 종료 처리 */
    if (option.next === "END") {
      await axios.post("/api/logSession", {
        sessionId: activeSessionId,
        mbti: mbtiRef.current,
        endedAt: Date.now(),
      });

      if (!abortRef.current && sessionIdRef.current === activeSessionId) {
        setCurrentScene("end_D"); // or target ending scene
        runScene(currentScenario, "end_D");
      }
      return;
    }

    /** 다음 장면으로 이동 */
    if (option.next) {
      if (!abortRef.current && sessionIdRef.current === activeSessionId) {
        setCurrentScene(option.next);
        runScene(currentScenario, option.next);
      }
    }
  };


  const start = async (mbti, userInfo) => {
    setCurrentScene(SCENE.CONTACT_DECISION);
    setHistory([]);
    setPendingChoice(null);
    mbtiRef.current = mbti;
    setCurrentMBTI(mbti);
    setAffection(0); // 애정도 초기화

    userInfoRef.current = userInfo;

    setIsEnding(false);

    const scenario = storyTable[mbti];
    setCurrentScenario(scenario);
    setCurrentLocation(LOCATION.DEFAULT);
    setLocationVersion((v) => v + 1); // 위치 버전 업데이트

    abortRef.current = false;
    runScene(scenario, SCENE.CONTACT_DECISION);
  };

  const reset = () => {
    abortRef.current = true;
    setHistory([]);
    setCurrentScenario(null);
    setCurrentScene(SCENE.CONTACT_DECISION);
    setPendingChoice(null);
    setCurrentMBTI(null);
    setCurrentLocation(LOCATION.DEFAULT);
    setIsEnding(false);
    setEngineError("");
    setAffection(0); // 애정도 초기화

    sessionIdRef.current = createSessionId();
    stepRef.current = 0;
  };

  const clearEngineError = () => setEngineError("");

  return {
    history,
    pendingChoice,
    currentScene,
    currentMBTI,
    currentLocation,
    locationVersion,
    isEnding,
    engineError,
    clearEngineError,
    start,
    choose,
    reset,
  };
}
