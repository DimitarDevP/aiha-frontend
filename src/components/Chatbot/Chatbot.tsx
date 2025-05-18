import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonModal,
    IonButton,
    IonIcon,
    IonButtons,
    useIonViewDidEnter
} from '@ionic/react';
import { informationCircle, close, send } from 'ionicons/icons';
import React, { useState, useEffect, useRef } from 'react';

const get_token = () => {
    let data = localStorage.getItem("persist:userAuth")
    let token = JSON.parse(data).access_token.slice(1, -1)
    return token
}

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<Array<any>>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showDisclaimer, setShowDisclaimer] = useState(false);
    const contentRef = useRef<HTMLIonContentElement>(null);
    useIonViewDidEnter(() => {
        setShowDisclaimer(true);
    });

    useEffect(() => {
        setIsLoading(true)
        fetch("http://127.0.0.1:5000/chat/send_message", { method: "POST", headers: { "Authorization": "Bearer " + get_token() } })
            .then(res => res.json())
            .then(data => {
                setMessages([{ ...data, text: data.message, isUser: false }])
                setIsLoading(false)
            })
    }, [])

    const handleSendMessage = () => {
        if (inputText.trim() === '') return;
        setIsLoading(true);
        const data = new FormData()
        data.append("thread_id", messages[0].thread_id)
        data.append("message", inputText)
        setMessages([...messages, { text: inputText, isUser: true }])
        fetch("http://127.0.0.1:5000/chat/send_message", {
            "method": "POST",
            "body": data,
            "headers": { "Authorization": "Bearer " + get_token() }
        })
            .then(res => res.json())
            .then(data => {
                setMessages([...messages, { text: inputText, isUser: true }, { ...data, text: data.message, isUser: false }])
                setIsLoading(false);
            })
        setInputText('');

    };
    console.log(messages)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const handleCloseDisclaimer = () => {
        setShowDisclaimer(false);
    };

    useEffect(() => {
        const scrollToBottom = async () => {
            if (contentRef.current) {
                await contentRef.current.scrollToBottom(300);
            }
        };
        scrollToBottom();
    }, [messages]);

    return (
        <IonPage>
            {/* Disclaimer Modal */}
            <IonModal
                isOpen={showDisclaimer}
                onDidDismiss={handleCloseDisclaimer}
                className="disclaimer-modal"
                backdropDismiss={false}
            >
                <div className="p-6 max-w-sm mx-auto text-center bg-white rounded-xl border border-indigo-100">
                    <div className="bg-indigo-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <IonIcon icon={informationCircle} className="text-3xl text-indigo-600" />
                    </div>
                    <h2 className="text-xl font-bold mb-4 text-indigo-900">Important Notice</h2>
                    <p className="mb-6 text-indigo-700">
                        You're talking to an AI health assistant. This is not a substitute
                        for professional medical advice. Always consult with your physician
                        before making any health-related decisions.
                    </p>
                    <IonButton
                        expand="block"
                        onClick={handleCloseDisclaimer}
                        className="mx-auto max-w-xs bg-indigo-600 hover:bg-indigo-700"
                    >
                        I Understand
                    </IonButton>
                </div>
            </IonModal>

            <IonHeader className="border-b border-indigo-100 bg-gradient-to-r from-indigo-500 to-teal-500">
                <IonToolbar>
                    <IonTitle className="text-white">AI Health Assistant</IonTitle>
                    <IonButtons slot="end">
                        <IonButton
                            fill="clear"
                            onClick={() => setShowDisclaimer(true)}
                            title="Show Disclaimer"
                            className="text-white hover:text-indigo-100"
                        >
                            <IonIcon icon={informationCircle} slot="icon-only" />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent ref={contentRef} fullscreen className="flex flex-col bg-indigo-50">
                <div className="flex-1 overflow-y-auto p-4 pt-8 space-y-4">
                    {messages.map((message, index) => (
                        <div
                            dangerouslySetInnerHTML={{ __html: message.text }}
                            key={index}
                            className={`p-3 rounded-xl max-w-xs ${message.isUser
                                ? 'bg-indigo-600 text-white self-end ml-auto'
                                : 'bg-white text-indigo-800 self-start mr-auto border border-indigo-100'
                                }`}
                        >
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-center space-x-2 bg-white p-3 rounded-xl max-w-[65px] self-start mr-auto border border-indigo-100">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
                        </div>
                    )}
                </div>
            </IonContent>

            <div className="sticky bottom-0 p-4 flex items-center gap-2 bg-white border-t border-indigo-100">
                <input
                    type="text"
                    value={inputText}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 p-3 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                    onClick={handleSendMessage}
                    disabled={inputText.trim() === ''}
                    className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <IonIcon icon={send} className="text-lg" />
                </button>
            </div>
        </IonPage>
    );
};

export default Chatbot;