import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonContent as IonContentType } from '@ionic/react';
import { useState, useEffect, useRef } from 'react';

const Tab2: React.FC = () => {
    const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
        { text: 'Hello! How can I help with your health today?', isUser: false },
    ]);
    const [inputText, setInputText] = useState('');
    const contentRef = useRef<IonContentType>(null);

    const handleSendMessage = () => {
        if (inputText.trim() === '') return;

        // Add user message
        setMessages([...messages, { text: inputText, isUser: true }]);
        setInputText('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    // Simulate AI response (replace with actual NLP logic later)
    useEffect(() => {
        if (messages[messages.length - 1]?.isUser) {
            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    { text: 'Based on the air quality data, it’s safe to jog today!', isUser: false },
                ]);
            }, 1000);
        }
    }, [messages]);

    // Autoscroll to bottom when messages change
    useEffect(() => {
        const scrollToBottom = async () => {
            if (contentRef.current) {
                await contentRef.current.scrollToBottom(300); // 300ms for smooth scrolling
            }
        };
        scrollToBottom();
    }, [messages]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Chatbot</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent ref={contentRef} fullscreen className="flex flex-col">
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Chatbot</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <div className="flex-1 overflow-y-auto p-4 pt-8 space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`p-3 rounded-lg max-w-xs ${
                                message.isUser
                                    ? 'bg-blue-500 text-white self-end ml-auto'
                                    : 'bg-gray-300 text-black self-start mr-auto'
                            }`}
                        >
                            {message.text}
                        </div>
                    ))}
                </div>
            </IonContent>
            <div className="sticky bottom-0 p-4 flex items-center gap-2 bg-white">
                <input
                    type="text"
                    value={inputText}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleSendMessage}
                    className="p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                        />
                    </svg>
                </button>
            </div>
        </IonPage>
    );
};

export default Tab2;