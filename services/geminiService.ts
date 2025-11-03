import { GoogleGenAI, Modality } from "@google/genai";
import { ImageFile, EditOptions } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const textModel = 'gemini-2.5-flash';
const visionModel = 'gemini-2.5-flash-image';

function base64ToGenerativePart(base64: string, mimeType: string) {
    return {
        inlineData: {
            data: base64.split(',')[1],
            mimeType
        }
    };
}

export const editImageWithGemini = async (
    image: ImageFile,
    editOptions: EditOptions,
    customPrompt: string
): Promise<string> => {
    
    const promptParts: string[] = ["Edita la imagen con las siguientes características:"];
    
    if (editOptions.style) {
        promptParts.push(`Estilo: '${editOptions.style}'.`);
    }
    if (editOptions.lighting) {
        promptParts.push(`Iluminación: '${editOptions.lighting}'.`);
    }
    if (editOptions.composition) {
        promptParts.push(`Composición: '${editOptions.composition}'.`);
    }

    if (customPrompt) {
        promptParts.push(`Instrucción adicional: ${customPrompt}`);
    }

    if (promptParts.length === 1) { // Only the initial instruction
        throw new Error("No se proporcionaron instrucciones de edición. Por favor, selecciona una opción o escribe un prompt.");
    }
    
    const fullPrompt = promptParts.join(' ');

    const imagePart = base64ToGenerativePart(image.base64, image.mimeType);

    const response = await ai.models.generateContent({
        model: visionModel,
        contents: {
            parts: [
                imagePart,
                { text: fullPrompt }
            ]
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    // Find the first image part in the response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }
    
    throw new Error("No image was generated in the response.");
};


export const getSuggestionWithGemini = async (editOptions: EditOptions): Promise<string> => {
    const existingEdits = [
        editOptions.style,
        editOptions.lighting,
        editOptions.composition,
    ].filter(Boolean).join(', ');
    
    let prompt = `Genera una sugerencia creativa y corta para editar una imagen. La sugerencia debe ser una instrucción simple. Por ejemplo: 'añade una bandada de pájaros en el cielo', 'cambia la estación a otoño', o 'haz que parezca una pintura de acuarela'.`;

    if (existingEdits) {
        prompt += ` La imagen ya tiene estas ediciones aplicadas: ${existingEdits}. Haz que la sugerencia sea compatible con estas ediciones existentes.`;
    }

    prompt += ` Devuelve solo el texto de la sugerencia, sin frases introductorias.`;

    const response = await ai.models.generateContent({
        model: textModel,
        contents: prompt
    });

    return response.text.trim();
};