import { useDispatch } from "react-redux";
import { LangType, setTranslations } from "../slicers/translation";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { API_KEY, API_URL } from "../utils/constants";

export const useTranslation = () => {

    const dispatch = useDispatch()

    const {
        transcript,
        resetTranscript,
    } = useSpeechRecognition()


    const startListening = (lang: string) => {
        SpeechRecognition.startListening({ continuous: true, language: lang })
    }

    const stopListening = async (lang: string) => {
        const targetLang = (lang === LangType.JAPANESE) ? LangType.CHINESE : LangType.JAPANESE
        SpeechRecognition.stopListening()
        await translation(targetLang)
        resetTranscript()
    }

    const translation = async (lang: string) => {
        if (!API_KEY) return console.log('API_KEY is not defined')
        const params = {
            auth_key: API_KEY,
            text: transcript,
            target_lang: lang,
        }
        const query = new URLSearchParams(params)
        const res = await fetch(`${API_URL}?${query}`)
        const data = await res.json()
        dispatch(setTranslations({
            orgWord: transcript,
            cvtWord: data.translations[0].text,
            type: lang
        }))
    }

    return {
        startListening,
        stopListening,
        transcript
    }
}