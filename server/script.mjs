import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

import { requestAPI } from "./requestAPI.mjs";
import { APIconfig } from "./APIconfig.mjs";

process.on("uncaughtException", function (exception) {
  console.log("Unexpecred error occurred");
});

// Function to create a delay
const delayBetweenCalls = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const getFreeSlots = async ({ id, date, cookie, token }) => {
  APIconfig.freeSlots.options.headers.set("Cookie", cookie);
  APIconfig.freeSlots.options.headers.set("X-CSRF-Token", token);
  APIconfig.freeSlots.options.headers.set(
    "Referer",
    `https://eq.hsc.gov.ua/site/step2?chdate=${date}&question_id=55&id_es=`
  );

  const freeSlots = await requestAPI({
    url: APIconfig.freeSlots.url,
    options: {
      ...APIconfig.freeSlots.options,
      body: `office_id=${id}&date_of_admission=${date}&question_id=55&es_date=&es_time=`,
    },
  });
  return freeSlots;
};

app.use(cors());

app.get("/freeSlots", async (req, res, next) => {
  const { startDate, endDate, cookie, token, id } = req.query;
  const dates = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Adjusting the end date to include it in the loop
  end.setDate(end.getDate() + 1);

  for (let date = start; date < end; date.setDate(date.getDate() + 1)) {
    dates.push(date.toISOString().slice(0, 10).replace(/-/g, "-"));
  }
  const daySlots = {};
  try {
    for (let date = 0; date < dates.length; date++) {
      const dayFreeSlots = await getFreeSlots({
        id: parseInt(id),
        date: dates[date],
        cookie,
        token,
      });
      daySlots[dates[date]] = dayFreeSlots?.rows ?? [];
      delayBetweenCalls(5000);
    }
    console.log(daySlots);
    res.json({ freeSlots: daySlots });
  } catch (error) {
    console.error(error);
    const errorOccurred = new Error(
      "Сервер не зміг отримати дані про вільні талони"
    );
    errorOccurred.status = 500;
    next(errorOccurred);
  }
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
