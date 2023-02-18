import * as React from "react";
import { useRef, useState } from "react";
import { startCase } from "lodash";
import { intervalToDuration } from "date-fns";
import { RoundTimer } from "../components/roundTimer";

export default function Home() {
  const classes = {
    "physical": {
      hitPointModifier: 0,
      damageModifier: 2,
      armourModifier: 2,
      icon: "https://cdn.glitch.global/0dd1f9e8-5f95-4760-ad67-93906c54fa55/DPS_Icon_1.png?v=1669718259900"
    },
    "caster": {
      hitPointModifier: 0,
      damageModifier: 2,
      armourModifier: 1,
      icon: "https://cdn.glitch.global/0dd1f9e8-5f95-4760-ad67-93906c54fa55/Magic_Ranged_DPS_Icon_1.png?v=1669718261359"
    },
    "healer": {
      hitPointModifier: 3,
      damageModifier: 0,
      armourModifier: 1,
      icon: "https://cdn.glitch.global/0dd1f9e8-5f95-4760-ad67-93906c54fa55/Healer_Icon_1.png?v=1669718258370"
    },
    "tank": {
      hitPointModifier: 0,
      damageModifier: 0,
      armourModifier: 3,
      icon: "https://cdn.glitch.global/0dd1f9e8-5f95-4760-ad67-93906c54fa55/Tank_Icon_1.png?v=1669718256078"
    }
  };
  
  const blankFighters = [
    {
      name: "Fighter One",
      class: "",
    },
    {
      name: "Fighter Two",
      class: "",
    },
    {
      name: "Fighter Three",
      class: "",
    },
    {
      name: "Fighter Four",
      class: "",
    },
  ];
  
  const blankInitiative = [
    {
      fighter: 0,
      log: []
    },
    {
      fighter: 1,
      log: []
    },
    {
      fighter: 2,
      log: []
    },
    {
      fighter: 3,
      log: []
    },
  ];
  
  const [fighterTracker, setFighterTracker] = useState(blankFighters);
  const [initTracker, setInitTracker] = useState(blankInitiative);
  const [showConfig, setShowConfig] = useState(false);
  
  const dialogRef = useRef(null);
  
  const [fighterOneName, setFighterOneName] = useState("Fighter One");
  const [fighterTwoName, setFighterTwoName] = useState("Fighter Two");
  const [fighterThreeName, setFighterThreeName] = useState("Fighter Three");
  const [fighterFourName, setFighterFourName] = useState("Fighter Four");
  const [fighterOneClass, setFighterOneClass] = useState(null);
  const [fighterTwoClass, setFighterTwoClass] = useState(null);
  const [fighterThreeClass, setFighterThreeClass] = useState(null);
  const [fighterFourClass, setFighterFourClass] = useState(null);
  const [fighterOneLog, setFighterOneLog] = useState([]);
  const [fighterTwoLog, setFighterTwoLog] = useState([]);
  const [fighterThreeLog, setFighterThreeLog] = useState([]);
  const [fighterFourLog, setFighterFourLog] = useState([]);
  const [currentFighter, setCurrentFighter] = useState(null);
  const [currentInitiativePosition, setCurrentInitiativePosition] = useState(0);
  const [startingFighter, setStartingFighter] = useState(null);
  const [targetFighter, setTargetFighter] = useState("");
  const [fightInitiative, setFightInitiative] = useState([0, 1, 2, 3]);
  const [damageRoll, setDamageRoll] = useState("");
  const [fightStarted, setFightStarted] = useState(false);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [fightLength, setFightLength] = useState(45);
  const [interventionOneTeamA, setInterventionOneTeamA] = useState(false);
  const [interventionTwoTeamA, setInterventionTwoTeamA] = useState(false);
  const [interventionOneTeamB, setInterventionOneTeamB] = useState(false);
  const [interventionTwoTeamB, setInterventionTwoTeamB] = useState(false);
  
  const getFightReport = (fighterLog) => {
    if (fighterLog.length > 0) {
      const fightReportList = fighterLog.map((item) => {
        if (item.limit) {
          return (
            <div className="fight-report-damage">
            <div className="fight-report-damage-attack">
              <div>Turn {item.turn}</div>
              <div>{item.name}</div>
            </div>
            <div className="fight-report-damage-amount">
              LB
            </div>
          </div>
          );
        }
        
        let damageAmount;
        
        if (item.amount >= 10) {
          damageAmount = item.amount;
        } else if (item.amount > 0) {
          damageAmount = `0${item.amount}`;
        } else {
          damageAmount = "--";
        }
        
        return (
          <div className="fight-report-damage">
            <div className="fight-report-damage-attack">
              <div>Turn {item.turn}</div>
              <div>{item.name}</div>
            </div>
            <div className="fight-report-damage-amount">
              {damageAmount}
            </div>
          </div>
        );
      });
      
      return (
        <div className="fight-report-log">
          {fightReportList.reverse()}
        </div>
      );
    }
    
    return (
      <div className="fight-report-log">  
        <em className="no-logs">Awaiting results</em>
      </div>
    ); 
  };
  
  const getFighterHealth = (fighterClass, fighterLog) => {
    if (fighterClass) {
      const hitPointBase = 25;
      const classModifiers = classes[fighterClass];

      let currentHitPoints = hitPointBase + classModifiers.hitPointModifier;
      
      fighterLog.forEach((hit) => {
        if (hit.limit) {
          currentHitPoints = 1;
        }
        
        currentHitPoints -= hit.amount;
      });
      
      return currentHitPoints < 0 ? "00" : currentHitPoints < 10 && currentHitPoints >= 0 ? `0${currentHitPoints}` : currentHitPoints;
    }
    
    
    return "--";
  };

  const getFighterIcon = (fighterClass) => {
    let iconSrc = "https://cdn.glitch.global/0dd1f9e8-5f95-4760-ad67-93906c54fa55/All-Rounder_Icon_1.png?v=1669718432007";
    
    if (fighterClass && classes[fighterClass]) {
      iconSrc = classes[fighterClass].icon;
    }
    
    return (
      <img src={iconSrc} height="64px" width="64px" />
    );
  };
  
  const getFighterPlate = (initSlot) => {    
    let plateClass = "fighter-plate";
    const fighterIndex = initTracker[initSlot].fighter;
    const fighterLog = initTracker[initSlot].log;
    const fighterName = fighterTracker[fighterIndex].name;
    const fighterClass = fighterTracker[fighterIndex].class;
    
    if (initSlot == currentInitiativePosition) {
      plateClass += " fighter-plate-active";
    }
        
    if (fighterIndex.toString() === targetFighter) {
      plateClass += " fighter-plate-target";
    }
    
    const fighterHealth = getFighterHealth(fighterClass, fighterLog);
    
    if (fighterHealth === "00") {
      plateClass += " fighter-plate-ko";
    }
    
    return (
      <div className={plateClass}>
        <div className="fighter-name">{fighterName}</div>
        <div className="fighter-hp">
          {getFighterIcon(fighterClass)}
          {fighterHealth}
        </div>
      </div>
    );
  };
   
  const getFighterClassButtons = (fighterClass, setFighterClass) => {
    const buttonList = [];
    
    for (const [key, value] of Object.entries(classes)) {
      let buttonClass = "fighterClassButton";
      
      if (fighterClass == key) {
        buttonClass += " fighterClassSelected";
      }
      
      buttonList.push(
        <button className={buttonClass} disabled={fightStarted} onClick={(e) => setFighterClass(key)} title={startCase(key)}>
          <img src={value.icon} height="32px" width="32px" />
        </button>
      );
    }
    
    return (
      <div className="fighter-class-buttons">
        {buttonList}
      </div>
    );
  };
  
  const changeCombatTurn = () => {
    // Check KO'd combatants
    const knockOuts = [];
    
    initTracker.forEach((_init, index) => {
      const fighterFromInit = initTracker[index].fighter;
      const fighterClass = fighterTracker[fighterFromInit].class;
      const fighterHealth = getFighterHealth(fighterClass, initTracker[index].log);
      const isFighterKO = fighterHealth != "--" && fighterHealth <= 0;
      
      if (isFighterKO) {
        knockOuts.push(index);
      }
    });
    
    let newInit = currentInitiativePosition;
    let newTurnStarted = false;
    
    do {
      newInit = newInit + 1;
      
      // Reset init if a new turn has started
      if (newInit > 3) {
        newInit = 0;
        newTurnStarted = true; 
      }
    }
    while (knockOuts.includes(newInit));
    
    if (newTurnStarted) {
      const newTurn = currentTurn + 1;
      setCurrentTurn(newTurn); 
    }
    
    setCurrentInitiativePosition(newInit);
    setDamageRoll("");
    setTargetFighter("");
  };
  
  const getLogForTarget = () => {
    const initForFighter = initTracker.find((init) => init.fighter.toString() === targetFighter);
    return initForFighter.log;
  };
  
  const setFighterLog = (log) => {
    const currentInit = [...initTracker];
    const initForFighter = currentInit.map(init => init.fighter.toString()).indexOf(targetFighter);
    currentInit[initForFighter].log = log;
    
    setInitTracker[currentInit];
    changeCombatTurn();
  };
  
  const dealFighterDamage = (damageAmount, criticalHit) => {
    const fighterIndex = initTracker[currentInitiativePosition].fighter;
    const fighterName = fighterTracker[fighterIndex].name;
    const fighterLog = getLogForTarget();
    fighterLog.push({amount: damageAmount, crit: criticalHit, name: fighterName, turn: currentTurn});
    
    setFighterLog(fighterLog);
  };
  
  const dealLBDamage = () => {
    const fighterIndex = initTracker[currentInitiativePosition].fighter;
    const fighterName = fighterTracker[fighterIndex].name;
    const fighterLog = getLogForTarget();
    fighterLog.push({amount: 0, limit: true, name: fighterName, turn: currentTurn});
    
    setFighterLog(fighterLog);
  };
  
  const getDamageButton = (attackHit, damageAmount, criticalHit) => {
    const fighterIndex = initTracker[currentInitiativePosition].fighter;
    const fighterLog = initTracker[currentInitiativePosition].log;
    const fighterName = fighterTracker[fighterIndex].name;
    
    if (targetFighter) {
      if (!attackHit) {
        return (
          <button className="full-button" onClick={(e) => dealFighterDamage(0)}>
            End {fighterName}'s Turn
          </button>
        );
      }

      return (
        <button className="full-button" onClick={(e) => dealFighterDamage(damageAmount, criticalHit)}>
          Apply to {fighterTracker[targetFighter].name}
        </button>
      );
    }
  };
  
  const getLBButton = () => {
    if (targetFighter) {
      return (
        <button className="full-button" onClick={dealLBDamage}>
          Weaken {fighterTracker[targetFighter].name}
        </button>
      );
    }
  };
  
  const getCurrentFighterInfo = () => {
    return fighterTracker[initTracker[currentInitiativePosition].fighter];
  };
  
  const getTargetFighterInfo = () => {
    return fighterTracker[targetFighter];
  };
  
  const getTargetOptions = () => {
    const checkDisabledOption = (fighterIndex) => {
      const currentFighterIndex = initTracker[currentInitiativePosition].fighter;
      const isCurrentFighter = currentFighterIndex.toString() === fighterIndex.toString();
      
      const initForFighter = initTracker.map(init => init.fighter.toString()).indexOf(fighterIndex.toString());
      const fighterName = fighterTracker[fighterIndex].name;
      const fighterClass = fighterTracker[fighterIndex].class;
      const fighterHealth = getFighterHealth(fighterClass, initTracker[initForFighter].log);
      const isFighterKO = fighterHealth != "--" && fighterHealth <= 0;
      
      return isCurrentFighter || isFighterKO;
    };
    
    return (
      <select disabled={!fightStarted} onChange={(e) => setTargetFighter(e.target.value)} value={targetFighter} style={{width: "100%"}}>
        <option disabled value="">Select target...</option>
        <option disabled={checkDisabledOption(0)} value={0}>{fighterTracker[0].name}</option>
        <option disabled={checkDisabledOption(1)} value={1}>{fighterTracker[1].name}</option>
        <option disabled={checkDisabledOption(2)} value={2}>{fighterTracker[2].name}</option>
        <option disabled={checkDisabledOption(3)} value={3}>{fighterTracker[3].name}</option>
      </select>
    );
  };
  
  const damageBreakdown = (damageNumber) => {
    if (!damageNumber) {
      return false;
    }
    
    const damageNumberInt = parseInt(damageNumber);
    
    if (damageNumberInt === 0) {
      return (
        <div className="damage-breakdown">
          <div>
            <div className="damage-hit">Fumble!</div>
          </div>
          {getDamageButton(false, 0, false)}
        </div>
      );
    }
    
    if (damageNumberInt < 300) {
      return (
        <div className="damage-breakdown">
          <div>
            <div className="damage-hit">Miss.</div>
          </div>
          {getDamageButton(false, 0, false)}
        </div>
      );
    }
    
    if (damageNumberInt === 999) {      
      return (
        <div className="damage-breakdown">
          <div className="limit-break">LIMIT BREAK</div>
          {getLBButton()}
        </div>
      );
    }
    
    const damageSplit = Array.from(damageNumber);
    
    const accuracy = parseInt(damageSplit[0]);
    const damage = parseInt(damageSplit[1] || 0);
    const critical = parseInt(damageSplit[2] || 0);
    
    const attackHit = accuracy >= 3;
    let damageAmount = damage === 0 ? 10 : damage;
    let damageAmountAdjusted = damageAmount;
    const criticalHit = critical === 0 || critical >= 7;
    
    const getFighterClass = getCurrentFighterInfo().class;
    const getOpponentClass = getTargetFighterInfo().class;
    
    damageAmountAdjusted = damageAmountAdjusted + classes[getFighterClass].damageModifier;
    
    if (criticalHit) {
      damageAmountAdjusted = damageAmountAdjusted * 2;
    }
    
    damageAmountAdjusted = damageAmountAdjusted - classes[getOpponentClass].armourModifier;
    
    if (damageAmountAdjusted < 0) {
      damageAmountAdjusted = 0;
    }
    
    return (
      <div className="damage-breakdown">
        <div>
          <div className="damage-hit">{attackHit ? criticalHit ? "Critical!" : "Hit!" : "Miss."}</div>
          {attackHit && <div>Deals <strong>{damageAmountAdjusted}</strong> damage:</div>}
          {attackHit && <ul className="damage-list">
            <li>{`${damageAmount} base`} {criticalHit && `(x2)`}</li>
            <li>{`+${classes[getFighterClass].damageModifier} ATK mod`} {criticalHit && `(x2)`}</li>
            <li>{`-${classes[getOpponentClass].armourModifier} DEF mod`}</li>
          </ul>}
        </div>
        {getDamageButton(attackHit, damageAmountAdjusted, criticalHit)}
      </div>
    );
  };
  
  const getInitOptions = (position) => {
    const setNewInitiative = (fighter) => {
      const newInit = [...fightInitiative];
      newInit[position] = fighter;
      setFightInitiative(newInit);
    };
    
    return (
      <select disabled={fightStarted} onChange={(e) => setNewInitiative(e.target.value)} value={fightInitiative[position]} style={{width: "100%"}}>
        <option value={0}>{fighterOneName}</option>
        <option value={1}>{fighterTwoName}</option>
        <option value={2}>{fighterThreeName}</option>
        <option value={3}>{fighterFourName}</option>
      </select>
    );
  };
  
  const startFight = () => {
    setFightStarted(true);
    setCurrentTurn(1);
  };
  
  const resetFight = () => {
    setFightStarted(false);
    setFighterOneName("Fighter One");
    setFighterTwoName("Fighter Two");
    setFighterThreeName("Fighter Three");
    setFighterFourName("Fighter Four");
    setFighterOneClass("");
    setFighterTwoClass("");
    setFighterThreeClass("");
    setFighterFourClass("");
    setFightInitiative([0, 1, 2, 3]);
    setFighterTracker(blankFighters);
    setInitTracker(blankInitiative);
    setDamageRoll("");
    setTargetFighter("");
    setCurrentTurn(0);
    setCurrentInitiativePosition(0);
    setInterventionOneTeamA(false);
    setInterventionTwoTeamA(false);
    setInterventionOneTeamB(false);
    setInterventionTwoTeamB(false);
  };
  
  const openFighterConfig = () => {
    if (dialogRef && dialogRef.current) {
      dialogRef.current.showModal();
    }
  };
  
  
  const closeFighterConfig = () => {
    if (dialogRef && dialogRef.current) {
      dialogRef.current.close();
    }
  };
  
  const saveFighterConfig = () => {
    const newInitConfig = [
      {
        fighter: fightInitiative[0],
        log: []
      },
      {
        fighter: fightInitiative[1],
        log: []
      },
      {
        fighter: fightInitiative[2],
        log: []
      },
      {
        fighter: fightInitiative[3],
        log: []
      },
    ];
    
    const newFighterConfig = [
      {
        name: fighterOneName,
        class: fighterOneClass,
      },
      {
        name: fighterTwoName,
        class: fighterTwoClass,
      },
      {
        name: fighterThreeName,
        class: fighterThreeClass,
      },
      {
        name: fighterFourName,
        class: fighterFourClass,
      },
    ];
    
    setFighterTracker(newFighterConfig);
    setInitTracker(newInitConfig);
    
    if (dialogRef && dialogRef.current) {
      dialogRef.current.close();
    }
  };

  return (
    <div className="container">
      <dialog ref={dialogRef}>
        <div>
          <div className="subtitle">Fighters</div>
          <div className="card fighter-group">
            <div className="fighter-input">
              <input disabled={fightStarted} placeholder="Fighter one name" onChange={(e) => setFighterOneName(e.target.value)} value={fighterOneName} />
              {getFighterClassButtons(fighterOneClass, setFighterOneClass)}
            </div>
            <div className="fighter-input">
              <input disabled={fightStarted} placeholder="Fighter two name" onChange={(e) => setFighterTwoName(e.target.value)} value={fighterTwoName}  />
              {getFighterClassButtons(fighterTwoClass, setFighterTwoClass)}
            </div>
          </div>
          <div className="fighter-vs">— VS —</div>
          <div className="card fighter-group">
            <div className="fighter-input">
              <input disabled={fightStarted} placeholder="Fighter three name" onChange={(e) => setFighterThreeName(e.target.value)} value={fighterThreeName} />
              {getFighterClassButtons(fighterThreeClass, setFighterThreeClass)}
            </div>
            <div className="fighter-input">
              <input disabled={fightStarted} placeholder="Fighter four name" onChange={(e) => setFighterFourName(e.target.value)} value={fighterFourName}  />
              {getFighterClassButtons(fighterFourClass, setFighterFourClass)}
            </div>
          </div>
          <div className="subtitle">Initiative order</div>
          <div className="card fighter-init">
            {getInitOptions(0)}
            {getInitOptions(1)}
            {getInitOptions(2)}
            {getInitOptions(3)}
          </div>
          <div className="subtitle">Fight length</div>
          <div className="card">
            <input disabled={fightStarted} placeholder="45" length="5" onChange={(e) => setFightLength(e.target.value)} type="number" value={fightLength} />
            {" "}minutes
          </div>
          <button
            disabled={!fighterOneClass || !fighterTwoClass || !fighterThreeClass || !fighterFourClass}
            onClick={saveFighterConfig}>
              Save
          </button>
          <button
            className="secondary"
            onClick={closeFighterConfig}>
              Close
          </button>
        </div>
      </dialog>
      <div className="fight-setup">
        <div className="card fighters">
          <div className="title">Match Setup</div>
          <button className="full-button" disabled={fightStarted} onClick={openFighterConfig}>
            Configure Fight
          </button>
          <div>
            <div className="subtitle">Controls</div>
            <div className="control-buttons">
              <button disabled={!fighterTracker[0].class || !fighterTracker[1].class || !fighterTracker[2].class || !fighterTracker[3].class || fightStarted} onClick={startFight}>
                Start Fight
              </button>
              <button className="danger" onClick={resetFight}>
                Reset Fight
              </button>
            </div>
          </div>
        </div>
        <div className="card rolls">
          <div className="title">Interventions</div>
          <div className="subtitle">{fighterTracker[0].name}<br />{fighterTracker[1].name}</div>
          <div className="interventions">
            <input type="checkbox" checked={interventionOneTeamA} onChange={(e) => setInterventionOneTeamA(e.checked)} />
            <input type="checkbox" checked={interventionTwoTeamA} onChange={(e) => setInterventionTwoTeamA(e.checked)} />
          </div>
          <div className="subtitle">{fighterTracker[2].name}<br />{fighterTracker[3].name}</div>
          <div className="interventions">
            <input type="checkbox" checked={interventionOneTeamB} onChange={(e) => setInterventionOneTeamB(e.checked)} />
            <input type="checkbox" checked={interventionTwoTeamB} onChange={(e) => setInterventionTwoTeamB(e.checked)} />
          </div>
        </div>
        <div className="card rolls">
          <div className="title">Calculator</div>
          <div className="subtitle">Target</div>
          {getTargetOptions()}
          <div className="subtitle">Roll</div>
          <input disabled={!fightStarted || !targetFighter} placeholder="Damage roll" onChange={(e) => setDamageRoll(e.target.value)} value={damageRoll} />
          {damageRoll && targetFighter && (
            <>
              <div className="subtitle">Result</div>
              {damageBreakdown(damageRoll)}
            </>
          )}
        </div>
      </div>
      <div className="fight-night">
        <div className="card fight-turns">
          <div className="turn">Turn {currentTurn}</div>
          <div className="countdown"><RoundTimer fightStarted={fightStarted} minsStart={fightLength} /></div>
        </div>
        <div className="card fight-for-four">
          <div className="fight-report">
            <div className="fighter-report">
              {getFighterPlate(0)}
              {getFightReport(initTracker[0].log)}
            </div>
            <div className="fighter-report">
              {getFighterPlate(1)}
              {getFightReport(initTracker[1].log)}
            </div>
          </div>
          <div className="fight-report">
            <div className="fighter-report">
              {getFighterPlate(2)}
              {getFightReport(initTracker[2].log)}
            </div>
            <div className="fighter-report">
              {getFighterPlate(3)}
              {getFightReport(initTracker[3].log)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
