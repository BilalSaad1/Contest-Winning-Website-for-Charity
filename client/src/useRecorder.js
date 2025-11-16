import { useState, useEffect } from 'react';

const useRecorder = () => {
    const [audioURL, setAudioURL] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [recorder, setRecorder] = useState(null);

    useEffect(() => {
        // Request permissions and set up the MediaRecorder
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    const newRecorder = new MediaRecorder(stream);
                    newRecorder.ondataavailable = e => {
                        const url = URL.createObjectURL(e.data);
                        setAudioURL(url);
                    };
                    setRecorder(newRecorder);
                });
        }
    }, []);

    const startRecording = () => {
        if (recorder !== null) {
            recorder.start();
            setIsRecording(true);
        }
    };
    const clearAudioURL = () => setAudioURL('');
    const stopRecording = () => {
        if (recorder !== null) {
            recorder.stop();
            setIsRecording(false);
        }
    };

    return { audioURL, isRecording, startRecording, stopRecording, clearAudioURL };
};
// Assuming this is in useRecorder.js
export default useRecorder;
