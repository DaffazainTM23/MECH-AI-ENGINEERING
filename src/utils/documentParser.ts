import JSZip from "jszip";

/**
 * Helper to convert files to base64 format for Gemini API application/pdf and image/jpeg etc
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(",")[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Extracts raw paragraphs text from a DOCX (packaged XML ZIP) file using JSZip
 */
export async function extractTextFromDocx(file: File): Promise<string> {
  try {
    const zip = await JSZip.loadAsync(file);
    const docXmlFile = zip.file("word/document.xml");
    if (!docXmlFile) {
      throw new Error("Invalid DOCX structure: missing word/document.xml");
    }
    const xmlContent = await docXmlFile.async("text");
    
    // Parse the XML in browser
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, "application/xml");
    
    // In Word XML, text resides inside <w:t> tags
    const textNodes = xmlDoc.getElementsByTagName("w:t");
    let fullText = "";
    for (let i = 0; i < textNodes.length; i++) {
      fullText += textNodes[i].textContent + " ";
    }
    return fullText.trim();
  } catch (error: any) {
    console.error("Error reading docx document content:", error);
    throw new Error("Unable to extract text from DOCX file: " + error.message);
  }
}
