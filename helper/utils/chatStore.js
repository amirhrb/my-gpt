import { create } from 'zustand';

const useChatStore = create((set, get) => ({
  messages: [],
  inProcess: false,
  toast: { status: '', toastMsg: '' },
  aiResponse: '',
  sendMessage: async (newMessage) => {
    set({ inProcess: true });
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({
          messages: [...get().messages, { role: 'user', content: newMessage }],
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.status !== 200) {
        set({
          inProcess: false,
          toast: {
            status: 'failure',
            toastMsg: `An error accured, ${data.message}`,
          },
        });
        return;
      }
      set({
        messages: [...get().messages, data.question],
      });
      const prevMessages = get().messages;
      let wordsArr = data.result.content.split(' ');
      let newWordIndex = 0;
      const addInterval = setInterval(() => {
        let newWord = `${wordsArr[newWordIndex++]} `;
        set({ aiResponse: (get().aiResponse += newWord) });
        set({
          messages: [
            ...prevMessages,
            { role: data.result.role, content: get().aiResponse },
          ],
        });
        if (newWordIndex >= wordsArr.length) {
          clearInterval(addInterval);
          newWordIndex = 0;
          set({ aiResponse: '' });
        }
      }, 200);
      set({
        inProcess: false,
      });
    } catch (error) {
      set({
        inProcess: false,
        toast: { status: 'error', toastMsg: error.message },
      });
    }
  },
}));

export default useChatStore;
