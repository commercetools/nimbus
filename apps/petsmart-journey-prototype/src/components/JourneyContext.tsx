import { createContext, useContext, useState, useCallback } from "react";
import type { JourneyDefinition } from "../data/journeyDefinitions";
import type { Persona } from "../data/personas";

interface JourneyContextValue {
  /** The currently active journey, or null if on the homepage */
  activeJourney: JourneyDefinition | null;
  /** The active persona (derived from activeJourney) */
  activePersona: Persona | null;
  /** Start a journey — sets the active journey and persona */
  startJourney: (journey: JourneyDefinition) => void;
  /** End the current journey */
  endJourney: () => void;
}

const JourneyContext = createContext<JourneyContextValue>({
  activeJourney: null,
  activePersona: null,
  startJourney: () => {},
  endJourney: () => {},
});

export const useJourney = () => useContext(JourneyContext);

export const JourneyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeJourney, setActiveJourney] = useState<JourneyDefinition | null>(
    null
  );

  const startJourney = useCallback((journey: JourneyDefinition) => {
    setActiveJourney(journey);
  }, []);

  const endJourney = useCallback(() => {
    setActiveJourney(null);
  }, []);

  const activePersona = activeJourney?.persona ?? null;

  return (
    <JourneyContext.Provider
      value={{ activeJourney, activePersona, startJourney, endJourney }}
    >
      {children}
    </JourneyContext.Provider>
  );
};
