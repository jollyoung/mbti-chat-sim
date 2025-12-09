import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { SCENE } from "../constants/sceneIDs";
import { LOCATION } from "../constants/locations";

// Н<oЙ,~Й▌кН~ б.OН?'Й,"
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

// Н,,Н.~ ID НЯ?Н,ё
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

  // dY"Э б~,И°?Й?, Н"И°?
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
      setEngineError(`Н<oЙ,~Й▌кН~Н-?Н,o '${sceneName}' Н°_Н?, Н^~ Н-+НSцЙ<^Й<.`);
      return;
    }

    const sceneArr = scenario[sceneName];

    const sceneLocation = sceneArr[0]?.location;

    if (sceneLocation && sceneLocation !== currentLocation) {
      setHistory([]);                 // Н?'Н , ЙO?бT" Н oИё°
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

      /** NPC/Player ЙO?Н,к */
      if (isNpc || isPlayer) {
        const delay = typeof item.delay === "number" ? item.delay : SPEECH_DELAY_MS;
        await new Promise((resolve) => setTimeout(resolve, delay));
        setHistory((prev) => [...prev, item]);
        continue;
      }

      /** Auto-advance when item only points to next scene */
      if (item.next && !item.type && !item.role) {
        if (!abortRef.current && sessionIdRef.current) {
          setCurrentScene(item.next);
          runScene(currentScenario, item.next);
        }
        return;
      }

      /** Н-"Й"c Н¤~Й▌к */
      if (item.type === "end") {
        setHistory(prev => [...prev, item]);  // Н-"Й"c ЙO?Н,к НoЙ Э

        if (!abortRef.current && sessionIdRef.current) {
          setTimeout(() => {
            setIsEnding(true); // dY`% Й^Н?Й% НoЙ Э б>, Н-"Й"c бZ~Н?'Н?Йнo
          }, 3000);
        }
        return;
      }

      /** Н, бЯ?Н? б`oН<o */
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

    setHistory(prev => [...prev, { role: "user", text: option.label }]);

    stepRef.current += 1;

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

    if (!option.silent) {
      setHistory(prev => [...prev, { role: "user", text: option.label }]);
    } else if (option.actionText) {
      const text = option.actionText(nicknameRef.current);
      setHistory(prev => [...prev, { role: "user", text }]);
    }


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
    setAffection(0); // Н'^И,°бT" dY"Э

    userInfoRef.current = userInfo;

    setIsEnding(false);

    const scenario = storyTable[mbti];
    setCurrentScenario(scenario);
    setCurrentLocation(LOCATION.DEFAULT);
    setLocationVersion((v) => v + 1); // D??,D?1~ DT3?D~ADп D?<o dY"D-

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
    setAffection(0); // Н'^И,°бT" dY"Э

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
