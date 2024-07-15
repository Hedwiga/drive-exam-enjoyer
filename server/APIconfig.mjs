export const freeSlotsHeaders = new Headers();
freeSlotsHeaders.append("Accept", "*/*");
freeSlotsHeaders.append("Accept-Language", "en-US,en;q=0.9");
freeSlotsHeaders.append("Connection", "keep-alive");
freeSlotsHeaders.append(
  "Content-Type",
  "application/x-www-form-urlencoded; charset=UTF-8"
);
freeSlotsHeaders.append("Origin", "https://eq.hsc.gov.ua");
freeSlotsHeaders.append("Sec-Fetch-Dest", "empty");
freeSlotsHeaders.append("Sec-Fetch-Mode", "cors");
freeSlotsHeaders.append("Sec-Fetch-Site", "same-origin");
freeSlotsHeaders.append(
  "User-Agent",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
);
freeSlotsHeaders.append("X-Requested-With", "XMLHttpRequest");
freeSlotsHeaders.append(
  "sec-ch-ua",
  '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"'
);
freeSlotsHeaders.append("sec-ch-ua-mobile", "?0");
freeSlotsHeaders.append("sec-ch-ua-platform", '"Windows"');

// Next headers to be reset in the script.mjs getFreeSlots function
freeSlotsHeaders.append(
  "Cookie",
  "_ga=GA1.3.474828923.1720274233; _gid=GA1.3.414445953.1720777978; _ga_TMNY850HX6=GS1.3.1720777978.3.0.1720777979.0.0.0; _ga_3GVV2WPF7F=GS1.3.1720936396.5.0.1720936396.0.0.0; WEBCHSID2=plr1e398fc1rbjrc2t23qh7k1i; _identity=7a01a3316b389a25889c274f0095076605eaa225583934c3cdedbc2dcaecb661a%3A2%3A%7Bi%3A0%3Bs%3A9%3A%22_identity%22%3Bi%3A1%3Bs%3A20%3A%22%5B1737947%2Cnull%2C28800%5D%22%3B%7D; _csrf=f76359cfb78acceeb9101ba71c029b334ce43e9cd582596dc69fd49bc56e0c48a%3A2%3A%7Bi%3A0%3Bs%3A5%3A%22_csrf%22%3Bi%3A1%3Bs%3A32%3A%22PZ4cRpcCWHP458uph6tJRxR8T-1Y2y63%22%3B%7D; WEBCHSID2=8qgug8cg7vgbseupo5sf3c7iog; _identity=7a01a3316b389a25889c274f0095076605eaa225583934c3cdedbc2dcaecb661a%3A2%3A%7Bi%3A0%3Bs%3A9%3A%22_identity%22%3Bi%3A1%3Bs%3A20%3A%22%5B1737947%2Cnull%2C28800%5D%22%3B%7D"
);
freeSlotsHeaders.append(
  "X-CSRF-Token",
  "KDtZfCC066qEpY5gRkRFNLaN_1pyos4yeVLVaql3aXl4YW0fcsSI6dPt3lRzfDBE3ruLECDanAotf-Qzmw5fSg=="
);
freeSlotsHeaders.append(
  "Referer",
  "https://eq.hsc.gov.ua/site/step2?chdate=2024-08-03&question_id=55&id_es="
);

export const APIconfig = {
  freeSlots: {
    url: "https://eq.hsc.gov.ua/site/freetimes",
    options: {
      method: "POST",
      headers: freeSlotsHeaders,
      redirect: "follow",
    },
  },
};
