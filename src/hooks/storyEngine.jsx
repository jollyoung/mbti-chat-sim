import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { SCENE } from "../constants/sceneIDs";
import { LOCATION } from "../constants/locations";

// MBTI 스토리 임포트
import INFP from "../stories/INFP";
import INFJ from "../stories/INFJ";
import INTJ from "../stories/INTJ";
import INTP from "../stories/INTP";
import ISFP from "../stories/ISFP";
import ISFJ from "../stories/ISFJ";
import ISTP from "../stories/ISTP";
import ISTJ from "../stories/ISTJ";
import ENFP from "../stories/ENFP";
import ENFJ from "../stories/ENFJ";
import ENTP from "../stories/ENTP";
import ENTJ from "../stories/ENTJ";
import ESFP from "../stories/ESFP";
import ESFJ from "../stories/ESFJ";
import ESTP from "../stories/ESTP";
import ESTJ from "../stories/ESTJ";

// 세션 ID 생성
const createSessionId = () => {
  const prefix = "session-";
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `${prefix}${timestamp}-${randomPart}`;
};

const SPEECH_DELAY_MS = 200;
const CHOICE_DELAY_MS = 600;

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
  const nicknameRef = useRef("");

  const sessionIdRef = useRef(createSessionId());
  const stepRef = useRef(0);
  const abortRef = useRef(false);

  const storyTable = {
    INFP,
    INFJ,
    INTP,
    INTJ,
    ISFP,
    ISFJ,
    ISTP,
    ISTJ,
    ENFP,
    ENFJ,
    ENTP,
    ENTJ,
    ESFP,
    ESFJ,
    ESTP,
    ESTJ,
  };

  const runScene = async (scenario, sceneName) => {
    if (!scenario || !scenario[sceneName]) {
      setEngineError(`스토리 엔진 오류: '${sceneName}' 씬을 찾을 수 없습니다.`);
      return;
    }

    const sceneArr = scenario[sceneName];

    const sceneLocation = sceneArr[0]?.location;

    if (sceneLocation && sceneLocation !== currentLocation) {
      setHistory([]);                 
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

      // 딜레이 후 메시지 추가
      if (isNpc || isPlayer) {
        const defaultDelay = 1500;
        const delay =
          typeof item.delay === "number"
            ? item.delay
            : defaultDelay;

        await new Promise((resolve) => setTimeout(resolve, delay));
        setHistory((prev) => [...prev, item]);
        continue;
      }


      // 다음 씬으로 이동
      if (item.next && !item.type && !item.role) {
        if (!abortRef.current && sessionIdRef.current) {
          setCurrentScene(item.next);
          runScene(currentScenario, item.next);
        }
        return;
      }

      // 엔딩 처리
      if (item.type === "end") {
        setHistory(prev => [...prev, item]);  // 엔딩 메시지 추가

        if (!abortRef.current && sessionIdRef.current) {
          setTimeout(() => {
            setIsEnding(true); // 엔딩 상태로 전환
          }, 3000);
        }
        return;
      }

      // 선택지 처리
      if (item.type === "choice") {
        await new Promise((resolve) => setTimeout(resolve, CHOICE_DELAY_MS));
        setPendingChoice(item);
        continue;
      }
    }
  };

  const attemptIndexRef = useRef(1);

  const choose = async (option) => {
    if (abortRef.current) return;

    setPendingChoice(null);

    stepRef.current += 1;

    // history에 넣을 사용자 메시지 결정
    let userMessage = option.label;
    if (option.silent) {
      if (option.actionText) {
        const nickname =
          nicknameRef?.current ??
          userInfoRef.current?.nickname ??
          "";
        userMessage = option.actionText(nickname);
      } else {
        userMessage = null; // silent + actionText 없으면 아무것도 표시 안 함
      }
    }
    
    if (userMessage) {
      setHistory((prev) => [...prev, { role: "user", text: userMessage }]);
    }

    await axios.post("/api/logChoice", {
      sessionId: sessionIdRef.current,
      step: stepRef.current,
      mbti: mbtiRef.current,
      scene: currentScene,
      userChoice: option.label,
      tone: option.tone || "",
      intent: option.intent || "",
      timestamp: Date.now(),
      sex: userInfoRef.current?.sex,
      age: userInfoRef.current?.age,
    });


    if (!option.next) {
      setIsEnding(true);
      return;
    }

    setCurrentScene(option.next);
    runScene(currentScenario, option.next);
  };



  const start = async (mbti, userInfo) => {
    setCurrentScene(SCENE.CONTACT_DECISION);
    setHistory([]);
    setPendingChoice(null);
    mbtiRef.current = mbti;
    setCurrentMBTI(mbti);
    nicknameRef.current = userInfo.nickname || "";

    userInfoRef.current = userInfo;

    setIsEnding(false);

    const scenario = storyTable[mbti];
    setCurrentScenario(scenario);
    setCurrentLocation(LOCATION.DEFAULT);
    setLocationVersion((v) => v + 1); // 위치 버전 증가

    abortRef.current = false;
    runScene(scenario, SCENE.CONTACT_DECISION);
  };


  const currentSceneRef = useRef(currentScene);
  useEffect(() => {
    currentSceneRef.current = currentScene;
  }, [currentScene]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const form = new FormData();
      form.append("sessionId", sessionIdRef.current);
      form.append("attemptIndex", attemptIndexRef.current);
      form.append("mbti", mbtiRef.current);
      form.append("scene", currentScene);
      form.append("userChoice", "[DROP_UNLOAD]");
      form.append("tone", "");
      form.append("intent", "");
      form.append("timestamp", Date.now());
      form.append("sex", userInfoRef.current?.sex ?? "");
      form.append("age", userInfoRef.current?.age ?? "");

      navigator.sendBeacon("/api/logChoice", form);
    };


    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);


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

    sessionIdRef.current = createSessionId();
    stepRef.current = 0;
    attemptIndexRef.current += 1;
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
