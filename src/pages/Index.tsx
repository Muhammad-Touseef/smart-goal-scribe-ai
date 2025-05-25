
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your SMART Goal Assistant. I'll help you create Specific, Measurable, Achievable, Relevant, and Time-bound goals. What goal would you like to work on today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // For now, simulate AI response since we need backend integration
      // In production, this would call your Express backend
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: "I understand you want to work on that goal. Let me help you make it SMART. Could you tell me more specifically what you want to achieve and by when?",
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Target className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">SMART Goal Assistant</h1>
          </div>
          <p className="text-gray-600">Create Specific, Measurable, Achievable, Relevant, and Time-bound goals</p>
        </div>

        <Card className="h-[600px] flex flex-col shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Goal Planning Chat
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 p-0 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="animate-pulse">Thinking...</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-gray-50">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe your goal..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="text-center p-4">
            <h3 className="font-semibold text-blue-600">Specific</h3>
            <p className="text-sm text-gray-600">Clear and well-defined</p>
          </Card>
          <Card className="text-center p-4">
            <h3 className="font-semibold text-green-600">Measurable</h3>
            <p className="text-sm text-gray-600">Trackable progress</p>
          </Card>
          <Card className="text-center p-4">
            <h3 className="font-semibold text-yellow-600">Achievable</h3>
            <p className="text-sm text-gray-600">Realistic and attainable</p>
          </Card>
          <Card className="text-center p-4">
            <h3 className="font-semibold text-purple-600">Relevant</h3>
            <p className="text-sm text-gray-600">Aligned with values</p>
          </Card>
          <Card className="text-center p-4">
            <h3 className="font-semibold text-red-600">Time-bound</h3>
            <p className="text-sm text-gray-600">Has a deadline</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
