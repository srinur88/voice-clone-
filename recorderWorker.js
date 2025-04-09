// recorderWorker.js
let recLength = 0,
  recBuffersL = [],
  recBuffersR = [],
  sampleRate;

self.onmessage = function(e){
  switch(e.data.command){
    case 'init':
      init(e.data.config);
      break;
    case 'record':
      record(e.data.buffer);
      break;
    case 'exportWAV':
      exportWAV(e.data.type);
      break;
    case 'clear':
      clear();
      break;
  }
};

function init(config){
  sampleRate = config.sampleRate;
}

function record(inputBuffer){
  recBuffersL.push(inputBuffer[0]);
  recBuffersR.push(inputBuffer[1]);
  recLength += inputBuffer[0].length;
}

function exportWAV(type){
  const bufferL = mergeBuffers(recBuffersL, recLength);
  const bufferR = mergeBuffers(recBuffersR, recLength);
  const interleaved = interleave(bufferL, bufferR);
  const dataview = encodeWAV(interleaved);
  const audioBlob = new Blob([dataview], { type: type });

  self.postMessage(audioBlob);
}

function clear(){
  recLength = 0;
  recBuffersL = [];
  recBuffersR = [];
}

function mergeBuffers(buffers, length){
  const result = new Float32Array(length);
  let offset = 0;
  for (let i = 0; i < buffers.length; i++){
    result.set(buffers[i], offset);
    offset += buffers[i].length;
  }
  return result;
}

function interleave(inputL, inputR){
  const length = inputL.length + inputR.length;
  const result = new Float32Array(length);
  let index = 0, inputIndex = 0;
  while (index < length){
    result[index++] = inputL[inputIndex];
    result[index++] = inputR[inputIndex];
    inputIndex++;
  }
  return result;
}

function encodeWAV(samples){
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  function writeString(view, offset, string){
    for (let i = 0; i < string.length; i++){
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  const sampleRate16 = sampleRate;
  const numChannels = 2;
  const bitsPerSample = 16;

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 32 + samples.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate16, true);
  view.setUint32(28, sampleRate16 * numChannels * bitsPerSample / 8, true);
  view.setUint16(32, numChannels * bitsPerSample / 8, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, 'data');
  view.setUint32(40, samples.length * 2, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2){
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }

  return view;
}
