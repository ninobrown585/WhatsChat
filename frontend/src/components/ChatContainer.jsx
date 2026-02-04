import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore'
import { useEffect, useRef } from 'react' // 1. Added useRef
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import MessageSkeleton from './Skeletons/MessageSkeleton' // Fixed typo in import
import { formatMessageTime } from '../lib/utils'

const ChatContainer = () => {
    const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
    const { authUser } = useAuthStore();
    const messageEndRef = useRef(null); // 2. Create the ref

    useEffect(() => {
        getMessages(selectedUser._id);
        subscribeToMessages();

        return () => unsubscribeFromMessages();
        
    }, [getMessages, subscribeToMessages, unsubscribeFromMessages, selectedUser._id]); // 3. Use ._id to prevent unnecessary re-runs

    // 4. Auto-scroll logic: runs whenever the messages array updates
    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    if (isMessagesLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />

            <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                {messages.map((message) => (
                    <div 
                        key={message._id} // Fixed: singular 'message'
                        className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                        ref={ messageEndRef }
                    >
                        <div className='chat-image avatar'>
                            <div className='size-10 rounded-full border'>
                                <img src={message.senderId === authUser._id 
                                    ? authUser.profilePic || "/avatar.png" 
                                    : selectedUser.profilePic || "/avatar.png"} 
                                    alt='profile pic'
                                />
                            </div>
                        </div>
                        <div className='chat-header mb-1'>
                            <time className="text-xs opacity-50 ml-1">
                                {formatMessageTime(message.createdAt)}
                            </time>                   
                        </div>  
                        <div className='chat-bubble flex flex-col'>
                            {message.image && (
                                <img src={message.image} alt="Attachment" className='sm:max-w-[200px] rounded-md mb-2' />
                            )}
                            {/* 5. Added message text rendering */}
                            {message.text && <p>{message.text}</p>}
                        </div>
                    </div>
                ))}
                {/* 6. This invisible div is the scroll anchor */}
                <div ref={messageEndRef} />
            </div>

            <MessageInput />
        </div>
    );
};

export default ChatContainer;