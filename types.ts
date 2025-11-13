
export interface Page {
    id: number;
    type: 'cover' | 'page';
    imageData: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}
