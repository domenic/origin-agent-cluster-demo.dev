const send = document.querySelector("#send");
const output = document.querySelector("#output");
const syncScript = document.querySelector("#sync-script");
const subframeSelector = document.querySelector("#subframe-selector");

send.onclick = async () => {
  const module = await WebAssembly.compileStreaming(fetch("simple.wasm"));
  frames[0].postMessage(module, "*");
};

syncScript.onclick = () => {
  try {
    frames[0].document.querySelector("#output").textContent += `Was able to script the iframe\n`;
  } catch (e) {
    output.textContent += `Failed to script the iframe: ${e.message}\n`;
  }
};

if (subframeSelector) {
  subframeSelector.onchange = () => {
    replaceSubframe(subframeSelector.value);
    location.hash = subframeSelector.value;
  };

  if (location.hash) {
    const frameURL = location.hash.substring(1);
    replaceSubframe(frameURL);
    subframeSelector.value = frameURL;
  } else {
    subframeSelector.onchange();
  }
}

function replaceSubframe(frameURL) {
  const iframe = document.createElement("iframe");
  iframe.src = frameURL;
  document.querySelector("iframe").replaceWith(iframe);
}

output.textContent += `window.originAgentCluster: ${window.originAgentCluster}\n`;

document.domain = "origin-isolation-test.com";
