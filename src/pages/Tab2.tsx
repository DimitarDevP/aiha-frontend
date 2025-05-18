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
import { informationCircle, close } from 'ionicons/icons';
import React, { useState, useEffect, useRef } from 'react';

const Tab2: React.FC = () => {
    const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
        { text: 'Hello! How can I help with your health today?', isUser: false },
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showDisclaimer, setShowDisclaimer] = useState(false);
    const contentRef = useRef<HTMLIonContentElement>(null);

    // Show disclaimer on initial render and every time the view enters
    useIonViewDidEnter(() => {
        setShowDisclaimer(true);
    });

    const handleSendMessage = () => {
        if (inputText.trim() === '') return;

        // Add user message
        const newMessages = [...messages, { text: inputText, isUser: true }];
        setMessages(newMessages);
        setInputText('');
        setIsLoading(true);

        // Simulate AI response
        setTimeout(() => {
            setMessages([...newMessages, { 
                text: 'Based on the air quality data, it\'s safe to jog today!', 
                isUser: false 
            }]);
            setIsLoading(false);
        }, 2000);
    };

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

    // Autoscroll to bottom when messages change
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
                <div className="p-6 max-w-sm mx-auto text-center relative">
                    <IonIcon 
                        icon={informationCircle} 
                        className="text-4xl text-blue-500 mb-4" 
                    />
                    <h2 className="text-xl font-bold mb-4">Important Notice</h2>
                    <p className="mb-6 text-gray-700">
                        You're talking to an AI health assistant. This is not a substitute 
                        for professional medical advice. Always consult with your physician 
                        before making any health-related decisions.
                    </p>
                    <IonButton 
                        expand="block" 
                        onClick={handleCloseDisclaimer}
                        className="mx-auto max-w-xs"
                        color="primary"
                    >
                        I Understand
                    </IonButton>
                </div>
            </IonModal>

            <IonHeader>
                <IonToolbar>
                    <IonTitle>AI Health Assistant</IonTitle>
                    <IonButtons slot="end">
                        <IonButton 
                            fill="clear" 
                            onClick={() => setShowDisclaimer(true)}
                            title="Show Disclaimer"
                        >
                            <IonIcon icon={informationCircle} slot="icon-only" />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            
            <IonContent ref={contentRef} fullscreen className="flex flex-col">
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">AI Health Assistant</IonTitle>
                    </IonToolbar>
                </IonHeader>
                
                <div className="flex-1 overflow-y-auto p-4 pt-8 space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`p-3 rounded-lg max-w-xs ${
                                message.isUser
                                    ? 'bg-blue-500 text-white self-end ml-auto'
                                    : 'bg-gray-200 text-gray-800 self-start mr-auto'
                            }`}
                        >
                            {message.text}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-center space-x-2 bg-gray-200 p-3 rounded-lg max-w-[65px] self-start mr-auto">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                        </div>
                    )}
                </div>
            </IonContent>
            
            <div className="sticky bottom-0 p-4 flex items-center gap-2 bg-white border-t border-gray-200">
                <input
                    type="text"
                    value={inputText}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                    onClick={handleSendMessage}
                    disabled={inputText.trim() === ''}
                    className="p-3 bg-blue-500 rounded-full text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 12L3.269 3.125A59.769 59.769 0 0121.485 12 59.768 59.768 0 013.27 20.875L5.999 12zm0 0h7.5"
                        />
                    </svg>
                </button>
            </div>
        </IonPage>
    );
};

export default Tab2;