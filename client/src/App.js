import { useState, useEffect } from "react";

import {
  Box,
  Text,
  Container,
  VStack,
  Input,
  Button,
  Card,
  CardBody,
  Grid,
  Heading,
  Wrap,
  Skeleton,
  Spinner,
  useToast,
  Divider,
  Center,
} from "@chakra-ui/react";

import Ding from "./ding.wav";

const OFFICE_ID = 177;
const DAYS_AFTER_TODAY = 20;
const SEARCH_INTERVAL_MS = 60000;

const BUTTON_TEXT = {
  stopped: "Розпочати пошук",
  found: "Розпочати пошук",
  search: "Зупинити пошук",
};

const audio = new Audio(Ding);

const startSound = () => {
  audio.play();
  audio.loop = true;
};

const stopSound = () => {
  audio.pause();
  audio.loop = false;
};

export const FreeSlotsSkeleton = ({ freeSlots }) => {
  return (
    <Skeleton
      minWidth="100%"
      maxHeight="25%"
      height="25%"
      isLoaded={Object.keys(freeSlots).length > 0}
    />
  );
};

export const App = () => {
  const [freeSlots, setFreeSlots] = useState({});

  // 'search', 'found', 'stopped'
  const [searchStatus, setSearchStatus] = useState("stopped");

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + DAYS_AFTER_TODAY);

  const formattedToday = today.toISOString().split("T")[0];
  const formattedMaxDate = maxDate.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(formattedToday);
  const [endDate, setEndDate] = useState(formattedMaxDate);

  const [cookie, setCookie] = useState(localStorage.getItem("APIcookie") ?? "");
  const [token, setToken] = useState(localStorage.getItem("APItoken") ?? "");

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const toast = useToast();

  useEffect(() => {
    if (isError) {
      toast({
        title: "Помилка",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsError(false);
    }
  }, [isError]);

  useEffect(() => {
    if (searchStatus === "found") {
      startSound();
    } else {
      stopSound();
    }
  }, [searchStatus]);

  const handleCookieChanged = (event) => {
    localStorage.setItem("APIcookie", event.target.value);
    setCookie(event.target.value);
  };

  const handleTokenChanged = (event) => {
    localStorage.setItem("APItoken", event.target.value);
    setToken(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    if (endDate < event.target.value) {
      setEndDate(""); // Reset end date if it's before the selected start date
    }
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleSearch = () => {
    let interval;
    const getFreeSlots = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/freeSlots?id=${OFFICE_ID}&startDate=${startDate}&endDate=${endDate}&cookie=${cookie}&token=${token}`
        );
        console.log(cookie);
        console.log(token);

        const data = await response.json();
        if (response.status !== 200) {
          throw new Error(data.error.message);
        }
        const allFreeSlotsDays = Object.keys(data.freeSlots).filter(
          (day) => data.freeSlots[day].length > 0
        );
        if (allFreeSlotsDays.length > 0) {
          setSearchStatus("found");
          clearInterval(interval);

          const allFreeSlots = {};
          allFreeSlotsDays.map((day) => {
            allFreeSlots[day] = data.freeSlots[day] || [];
          });
          setFreeSlots(allFreeSlots);
        }

        setIsError(false);
      } catch (error) {
        setIsError(true);
        setErrorMessage(error.message);
        console.error(error);
      }
    };

    const tryGetFreeSlots = () => {
      getFreeSlots();
    };

    if (searchStatus === "stopped" || searchStatus === "found") {
      setIsError(false);

      // Start search
      setFreeSlots([]);
      setSearchStatus("search");
      tryGetFreeSlots();

      interval = setInterval(() => {
        tryGetFreeSlots();
      }, [SEARCH_INTERVAL_MS]);
    } else if (searchStatus === "search") {
      setIsError(false);

      // Stop search
      setSearchStatus("stopped");
      clearInterval(interval);
    }
  };

  return (
    <Box>
      <Grid
        templateColumns="repeat(2, 1fr)"
        minHeight="100vh"
        alignItems="center"
        padding={10}
        gap={10}
      >
        <VStack spacing={3}>
          <Heading as="h5" size="sm">
            Cookie
          </Heading>
          <Input size="lg" value={cookie} onChange={handleCookieChanged} />
          <Heading as="h5" size="sm">
            X-CSRF-Token
          </Heading>
          <Input size="lg" value={token} onChange={handleTokenChanged} />
          <Divider />
          <Heading as="h5" size="sm">
            Початкова дата прийому
          </Heading>
          <Input
            size="lg"
            type="date"
            placeholder="Start Date"
            min={formattedToday}
            max={formattedMaxDate}
            value={startDate}
            onChange={handleStartDateChange}
          />
          <Heading as="h5" size="sm">
            Кінцева дата прийому
          </Heading>
          <Input
            size="lg"
            type="date"
            placeholder="End Date"
            min={startDate || formattedToday}
            max={formattedMaxDate}
            value={endDate}
            onChange={handleEndDateChange}
          />
          <Button
            width="100%"
            colorScheme="teal"
            size="lg"
            rightIcon={searchStatus === "search" && <Spinner />}
            onClick={handleSearch}
          >
            {BUTTON_TEXT[searchStatus]}
          </Button>
        </VStack>
        <VStack height="100%" maxHeight="100%">
          {searchStatus === "stopped" ? (
            <Center height="100%">
              <Heading as="h5" size="sm">
                Тут будуть результати пошуку
              </Heading>
            </Center>
          ) : (
            <>
            {Object.keys(freeSlots).length === 0 && <>
              <FreeSlotsSkeleton freeSlots={freeSlots} />
              <FreeSlotsSkeleton freeSlots={freeSlots} />
              <FreeSlotsSkeleton freeSlots={freeSlots} />
              <FreeSlotsSkeleton freeSlots={freeSlots} />
              </>
            }
              <Container overflowY="scroll" maxHeight='90vh' padding={0}>
                {Object.keys(freeSlots).map((day) => {
                  return (
                    <VStack key={`slots-day-${day}`} align="start" spacing={4}>
                      <br />
                      <Heading as="h5" size="sm">
                        {day}
                      </Heading>
                      <Wrap>
                        {freeSlots[day].map(({ chtime }) => {
                          return (
                            <Card key={`slot-${day-chtime}`} backgroundColor="#48BB78">
                              <CardBody>
                                <Text>{chtime}</Text>
                              </CardBody>
                            </Card>
                          );
                        })}
                      </Wrap>
                    </VStack>
                  );
                })}
              </Container>
            </>
          )}
        </VStack>
      </Grid>
    </Box>
  );
};
