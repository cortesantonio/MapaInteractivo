import { useEffect, useState } from 'react';
import { LiveAudioVisualizer } from 'react-audio-visualize';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface Props {
  activarReconocimiento: boolean;
}

const Reconocimiento = ({ activarReconocimiento}: Props) => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [visualizerActive, setVisualizerActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const {
    transcript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    const iniciarReconocimiento = async () => {
      try {
        const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setStream(micStream);
        const recorder = new MediaRecorder(micStream);
        recorder.start();
        setMediaRecorder(recorder);
        SpeechRecognition.startListening({ continuous: true, language: 'es-CL' });
        setVisualizerActive(true);
        
      } catch (err) {
        console.error('Error al acceder al micrófono:', err);
      }
    };

    if (activarReconocimiento) {
      iniciarReconocimiento();
    }
    else {
      SpeechRecognition.stopListening();
      setVisualizerActive(false);
      if (mediaRecorder) mediaRecorder.stop();
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
        setMediaRecorder(null);
      }
    }
  }, [activarReconocimiento]);

  useEffect(() => {
    if (transcript) {
      console.log("Transcripción:", transcript);
    }
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <p>Tu navegador no soporta reconocimiento de voz.</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      {mediaRecorder && visualizerActive && (
        <div style={{ marginTop: 20 }}>
          <LiveAudioVisualizer
            mediaRecorder={mediaRecorder}
            width={250}
            barWidth={2}
            gap={1}
            fftSize={2048}
            maxDecibels={75}
            minDecibels={-100}
          />
        </div>
      )}
    </div>
  );
};

export default Reconocimiento;

