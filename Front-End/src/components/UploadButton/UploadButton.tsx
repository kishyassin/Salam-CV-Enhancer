'use client'
import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, FileText, ArrowRight, Loader2, Sparkles, Search } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import Image from 'next/image'
import Link from 'next/link';
import { PDFDocument, rgb } from 'pdf-lib';
// import { jsPDF } from "jspdf";
// import PDFDocument from 'pdfkit';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { motion } from "framer-motion"

const UploadButton = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [companyName, setCompanyName] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [selectedLanguage, setSelectedLanguage] = useState<string>('')
    // const [contentPdf, setContentPdf] = useState<string>();
    const [enhancements, setEnhancements] = useState<any[]>([])
    const [data, setData] = useState<string>('');
    const [dataText, setDataText] = useState<string>('');
    const [language, setLanguage] = useState<string>('fr');


    const handleProcess = async () => {
        if (!selectedFile || isProcessing) return;

        setIsProcessing(true);
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('lang', selectedLanguage);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const resp = await response.json();
            // console.log('Upload successful:', resp);
            setDataText(resp.text);
            setLanguage(resp.language);
            setEnhancements(resp.enhancements || []);
            setIsOpen(true);
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    async function generateResumee() {
        const apiKey = "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";
        const endpoint = "https://api.groq.com/openai/v1/chat/completions";
        // const textCv = await fetchPdfContent();
        // console.log("language", language);
        const imageUrl = "/Logo22.png";
        const prompt = language === "Fr" ? `
    // Vous êtes un expert en rédaction de lettres de motivation. 
    // Reformulez le texte fourni (${dataText}) en respectant la structure demandée, 
    // mais en évitant d'utiliser exactement les mêmes mots dans cette structure. 
    // Soyez simple et clair.
    // ne pas faire de commentaires

    Nom : 
    Adresse : 
    Téléphone : 
    E-mail : 
    Entreprise : ${companyName}
    Adresse de l'entreprise : 
    Recruteur : 

    Objet :  

    Madame, Monsieur,

    Actuellement à la recherche d'une opportunité enrichissante, je suis vivement intéressé par le poste de au sein de votre entreprise ${companyName}, dont j'ai pris connaissance via .

    Passionné par le développement web, j'ai acquis une expertise en au fil de mes d'expérience chez . J'y ai notamment . 

    Ce qui m'attire particulièrement dans votre entreprise, c'est son engagement envers l'innovation et l'excellence technologique. Mon expérience et ma maîtrise des technologies modernes me permettent de m'intégrer rapidement et de contribuer efficacement à vos projets.

    Je suis convaincu que mon dynamisme, ma rigueur et mon expertise technique pourront être des atouts pour votre équipe. Disponible immédiatement, je serais ravi d'échanger avec vous lors d'un entretien.

    Dans l'attente de votre retour, veuillez agréer, ${companyName}, l'expression de mes salutations distinguées.`
            : `
    You are an expert in writing cover letters.
    Rephrase the provided text (${dataText}) while maintaining the required structure,
    but avoiding the use of the exact same words in this structure.
    Be simple and clear.

    Name:  
    Address:  
    Phone:  
    Email:  
    Company: ${companyName}  
    Company Address:  
    Recruiter:  

    Subject:  

    Dear Sir/Madam,

    Currently , I am highly interested in the position at your company ${companyName}, which I learned about through .

    Passionate about web development, I have gained expertise in over my years of experience at . During that time, I have .  

    What particularly attracts me to your company is its commitment to innovation and technological excellence. My experience and mastery of modern technologies allow me to integrate quickly and contribute effectively to your projects.

    I am confident that my dynamism, precision, and technical expertise will be valuable assets to your team. Available immediately, I would be delighted to discuss further in an interview.

    Looking forward to your response, please accept, ${companyName}, my best regards.`;


        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            })
        });

        const data = await response.json();

        if (response.ok) {
            // console.log("Generated Résumé:", data.choices[0].message.content);

            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage([595, 842]); // A4 size
            const fontSize = 12;
            const margin = 40;
            const imageBytes = await fetch(imageUrl).then(res => res.arrayBuffer());
            const image = await pdfDoc.embedPng(imageBytes);

            // Set fixed dimensions for the logo
            const logoWidth = 150;
            const logoHeight = 50;

            // Position the logo at the top
            page.drawImage(image, {
                x: 400,
                y: 780,
                width: logoWidth,
                height: logoHeight
            });


            const content = data.choices[0].message.content;
            let yPosition = 750;

            page.drawText(content, {
                x: margin,
                y: yPosition,
                size: fontSize,
                color: rgb(0, 0, 0),
                maxWidth: 500
            });

            const pdfBytes = await pdfDoc.save();
            const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
            const pdfUrl = URL.createObjectURL(pdfBlob);

            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = 'resume.pdf';
            link.click();
        } else {
            console.error("Error generating résumé:", data.error.message);
        }
    }


    const handleSelectCompany = (company: string, position: string) => {
        setCompanyName(`${company} - ${position}`)
        setShowSuggestions(false)
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        if (file.type !== 'application/pdf') {
            alert('Please select a PDF file')
            return
        }

        setIsLoading(true)

        const url = URL.createObjectURL(file)
        setSelectedFile(file)
        setPreviewUrl(url)

        setTimeout(() => {
            setIsLoading(false)
        }, 1000)

        return () => {
            if (url) URL.revokeObjectURL(url)
        }
    }



    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (!target.closest('#company-search-container')) {
                setShowSuggestions(false)
            }
        }

        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [])

    return (
        <>
            <div className="flex flex-col gap-4 w-full mx-auto max-w-[1200px] items-center">
                {!selectedFile ? (
                    <Button
                        variant="outline"
                        className="flex items-center gap-2 w-[250px] h-[60px] bg-[#1098F7] text-white hover:bg-[#1098F7]/90 relative rounded-lg"
                        size="lg"
                    >
                        <Input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            id="pdf-upload"
                        />
                        {isLoading ? (
                            <>
                                <Loader2 className="h-6 w-6 animate-spin" />
                                <p className="text-lg">Processing...</p>
                            </>
                        ) : (
                            <>
                                <Upload className="h-6 w-6" />
                                <p className="text-lg">Select Your File</p>
                            </>
                        )}
                    </Button>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2">
                            <FileText className="h-6 w-6 text-[#1098F7]" />
                            <p className="text-lg truncate max-w-[150px]">{selectedFile.name}</p>
                        </div>

                        <Select onValueChange={(value) => setSelectedLanguage(value)} value={selectedLanguage}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="En">English</SelectItem>
                                <SelectItem value="Fr">French</SelectItem>
                            </SelectContent>
                        </Select>


                        <Button
                            variant="outline"
                            className="flex items-center gap-2 w-[250px] h-[60px] bg-[#1098F7] text-white hover:bg-[#1098F7]/90 rounded-lg"
                            size="lg"
                            onClick={handleProcess}
                            disabled={selectedLanguage === '' || isProcessing}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                    <p className="text-lg">Processing...</p>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-6 w-6" />
                                    <p className="text-lg">Process</p>
                                </>
                            )}
                        </Button>
                        {!selectedLanguage && (
                            <motion.p
                                className='text-red-500'
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.3,
                                    delay: 0.5,
                                    ease: "easeOut"
                                }}
                                exit={{ opacity: 0 }}
                            >
                                Select a Language First
                            </motion.p>
                        )}
                    </div>
                )}

                {previewUrl && (
                    <div className="w-[500px] h-[500px] border rounded-lg overflow-hidden">
                        <iframe
                            src={previewUrl}
                            className="w-full h-full"
                            title="PDF Preview"
                        />
                    </div>
                )}

                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
                        <SheetHeader>
                            <SheetTitle className='text-2xl font-bold'>CV Options</SheetTitle>
                        </SheetHeader>

                        <div className="flex-1 overflow-y-auto">
                            <div className="mb-6">
                                <label htmlFor="company-name" className="block text-sm font-medium mb-2">
                                    Select company and position
                                </label>
                                <div className="relative">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="company-name"
                                            placeholder="Search company..."
                                            value={companyName}
                                            onChange={(e) => {
                                                setCompanyName(e.target.value)
                                            }}
                                            className="pl-10 mb-3"
                                        />
                                    </div>
                                </div>

                            </div>

                            <div>
                                <h3 className="text-lg font-semibold">Improvements for The CV</h3>
                                <div className="mt-2 bg-[#63b7f3] p-4 rounded-lg text-white">
                                    <p className="text-sm font-bold p-2">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="font-semibold mb-4">Suggested Changes</h3>
                                <div className="flex flex-col gap-4">
                                    {enhancements.map((enhancement, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <p className="text-sm font-medium">{enhancement.section}</p>
                                                    <p className="text-sm text-gray-600">{enhancement.description}</p>
                                                </div>
                                            </div>
                                            <Link
                                                href="#"
                                                className="flex items-center gap-1 text-[#1098F7] hover:underline"
                                            >
                                                Apply
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t">
                            <Button
                                className="w-full bg-[#1098F7] text-white hover:bg-[#1098F7]/90 cursor-pointer"
                                size="lg"
                                onClick={generateResumee}
                            >
                                Generate A Cover Letter
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    )
}

export default UploadButton