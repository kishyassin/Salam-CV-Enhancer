'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, FileText, ArrowRight, Loader2, Sparkles, Search } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import Image from 'next/image'
import Link from 'next/link';
// import { jsPDF } from "jspdf";
import pdfGen from '../pdfGen'
import PdfGen from '../pdfGen'

const UploadButton = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [companyName, setCompanyName] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [contentPdf, setContentPdf] = useState<string>();


    async function generateResumee() {
        const apiKey = "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"; // Replace with your Groq API key
        const endpoint = "https://api.groq.com/openai/v1/chat/completions"; // Groq API endpoint
    
        // Pre-structured CV data
        const cvData = {
            name: "Omar Khabou",
            profession: "Ingénieur Logiciel", // French title
            skills: ["JavaScript", "React", "Node.js", "TypeScript", "Python", "SQL", "Cloud Computing"],
            education: "Diplôme en Informatique",
            experience: [
                {
                    company: "XYZ Corp",
                    position: "Développeur Web",
                    duration: "3 ans",
                    description: "Développement d'applications web avec React et Node.js."
                }
            ],
            contact: {
                address: "1234 Rue Principale, Ville, Pays",
                phone: "+123456789",
                email: "omar.khabou@example.com"
            },
            companyInfo: {
                name: "XYZ Corp",
                address: "5678 Parc d'Affaires, Ville, Pays",
                recruiter: "Jean Dupont"
            },
            jobTitle: "Développeur Web",
            jobSource: "LinkedIn"
        };
    
        // Detect CV language (English or French)
        const language = cvData.profession.match(/[\u0600-\u06FF]/) ? "ar" :
                     cvData.profession.match(/[a-zA-Z]/) ? "fr" : "en";
    
        // Generate the résumé in the same language
        const prompt = language === "fr" ? `
            Vous êtes un créateur de CV professionnel. Soyez simple et clair, n'utilisez pas toujours les mêmes mots, respectez simplement cette structure.
            ne pas dire ce que vous avez modifie
            Lettre de motivation pour le poste de ${cvData.jobTitle}
    
            Nom : ${cvData.name}
            Adresse : ${cvData.contact.address}
            Téléphone : ${cvData.contact.phone}
            E-mail : ${cvData.contact.email}
            Entreprise : ${companyName}
            Adresse de l'entreprise : ${cvData.companyInfo.address}
            Recruteur : ${cvData.companyInfo.recruiter}
    
            Objet :  ${cvData.jobTitle}
    
            Madame, Monsieur,
    
            Actuellement ${cvData.profession}, je suis vivement intéressé par le poste de ${cvData.jobTitle} au sein de votre entreprise ${companyName}, dont j’ai pris connaissance via ${cvData.jobSource}.
    
            Passionné par le développement web, j’ai acquis une expertise en ${cvData.skills.join(", ")} au fil de mes ${cvData.experience[0].duration} d’expérience chez ${cvData.experience[0].company}. J’y ai notamment ${cvData.experience[0].description}. 
    
            Ce qui m’attire particulièrement dans votre entreprise, c’est son engagement envers l’innovation et l’excellence technologique. Mon expérience et ma maîtrise des technologies modernes me permettent de m’intégrer rapidement et de contribuer efficacement à vos projets.
    
            Je suis convaincu que mon dynamisme, ma rigueur et mon expertise technique pourront être des atouts pour votre équipe. Disponible immédiatement, je serais ravi d’échanger avec vous lors d’un entretien.
    
            Dans l’attente de votre retour, veuillez agréer, ${companyName}, l’expression de mes salutations distinguées.
    
            ${cvData.name}
        ` : language === "en" ? `
            you are a profetional resume generator 
            be simple and clear don't use everytime the same words just follow this structure
            Cover Letter for the Position of ${cvData.jobTitle}

            Name: ${cvData.name}
            Address: ${cvData.contact.address}
            Phone: ${cvData.contact.phone}
            Email: ${cvData.contact.email}
            Company: ${cvData.companyInfo.name}
            Company Address: ${cvData.companyInfo.address}
            Recruiter: ${cvData.companyInfo.recruiter}
    
            Subject: ${cvData.jobTitle}
    
            Dear Sir/Madam,
    
            As a ${cvData.profession}, I am highly interested in the ${cvData.jobTitle} position at your company, ${companyName}, which I discovered via ${cvData.jobSource}.
    
            Passionate about web development, I have gained expertise in ${cvData.skills.join(", ")} over my ${cvData.experience[0].duration} of experience at ${cvData.experience[0].company}. There, I ${cvData.experience[0].description}. 
    
            What attracts me most to your company is its commitment to innovation and technological excellence. My experience and expertise in modern technologies allow me to integrate quickly and contribute effectively to your projects.
    
            I am confident that my dynamism, rigor, and technical expertise will be valuable assets to your team. I am available immediately and would be delighted to discuss my application further in an interview.
    
            Looking forward to your response, please accept, ${companyName}, my best regards.
    
            ${cvData.name}
        `: `
            أنت مُنشئ سيرة ذاتية محترف. كن بسيطًا وواضحًا. لا تستخدم نفس الكلمات دائمًا. فقط اتبع هذا الهيكل.
            خطاب التقديم لوظيفة ${cvData.jobTitle}

        الاسم: ${cvData.name}
        العنوان: ${cvData.contact.address}
        الهاتف: ${cvData.contact.phone}
        البريد الإلكتروني: ${cvData.contact.email}
        الشركة: ${cvData.companyInfo.name}
        عنوان الشركة: ${cvData.companyInfo.address}
        مسؤول التوظيف: ${cvData.companyInfo.recruiter}

        الموضوع: ${cvData.jobTitle}

        السيد/السيدة المحترم،

        أنا ${cvData.profession} وأرغب بشدة في التقدم لوظيفة ${cvData.jobTitle} في شركتكم الموقرة، ${cvData.companyInfo.name}، التي علمت عنها عبر ${cvData.jobSource}.

        شغفي بتطوير الويب مكنني من اكتساب خبرة واسعة في ${cvData.skills.join(", ")} على مدى ${cvData.experience[0].duration} في شركة ${cvData.experience[0].company}. حيث قمت بـ ${cvData.experience[0].description}. 

        ما يجذبني إلى شركتكم هو التزامها بالابتكار والتميز التكنولوجي. خبرتي ومعرفتي بأحدث التقنيات تتيح لي الاندماج بسرعة والمساهمة بفعالية في مشاريعكم.

        أنا واثق بأنني سأكون إضافة قوية لفريقكم من خلال مهاراتي وديناميكيتي ودقتي في العمل. أنا متاح فورًا ويسعدني مناقشة طلبي خلال مقابلة.

        بانتظار ردكم الكريم، وتفضلوا بقبول فائق الاحترام والتقدير، ${cvData.companyInfo.recruiter}.

        ${cvData.name}
        
        `
    
        // Send request to Groq API
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
            console.log("Generated Résumé:", data.choices[0].message.content);
            setContentPdf(data.choices[0].message.content);
            // Create PDF using jsPDF
            // const doc = new jsPDF();
            // doc.setFont("helvetica", "normal");
            // const content = data.choices[0].message.content;
            // const lines = doc.splitTextToSize(content, 180);
            // // Justify the text manually by adjusting spacing
            // const margin = 10;
            // let yPosition = 10;
            // lines.forEach((line: string) => {
            // doc.text(line, margin, yPosition);
            // yPosition += 6; // Adjust line spacing
            // });

            // doc.save("resume.pdf");
        } else {
            console.error("Error generating résumé:", data.error.message);
        }
    }


    
    
    const suggestions = [
        {
            logo: "/netflixLogo.png",
            company: "Netflix",
            position: "Software Engineer"
        },
        {
            logo: "/amazonLogo.png",
            company: "Amazon",
            position: "Software Engineer"
        }
    ]

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

        // Create object URL
        const url = URL.createObjectURL(file)
        setSelectedFile(file)
        setPreviewUrl(url)

        // Show preview first, then open sheet after a delay
        setTimeout(() => {
            setIsOpen(true)
            setIsLoading(false)
        }, 1000)

        // Cleanup
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

        <div className="flex flex-col gap-4 w-full mx-auto max-w-[1200px] items-center">
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
                ) : selectedFile ? (
                    <>
                        <FileText className="h-6 w-6" />
                        <p className="text-lg truncate max-w-[150px]">{selectedFile.name}</p>
                    </>
                ) : (
                    <>
                        <Upload className="h-6 w-6" />
                        <p className="text-lg">Select Your File</p>
                    </>
                )}
            </Button>

            {previewUrl && (
                <div className="w-[500px] h-[500px] border rounded-lg overflow-hidden">
                    <iframe
                        src={previewUrl}
                        className="w-full h-full"
                        title="PDF Preview"
                    />
                </div>
            )}
            <PdfGen text={contentPdf}/>
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
                                            setShowSuggestions(true)
                                        }}
                                        onFocus={() => setShowSuggestions(true)}
                                        className="pl-10 mb-3"
                                    />
                                </div>

                                {showSuggestions && (
                                    <div className="absolute w-full bg-white rounded-md border border-gray-200 shadow-lg mt-1 max-h-60 overflow-auto z-50">
                                        {suggestions
                                            .filter(s =>
                                                s.company.toLowerCase().includes(companyName.toLowerCase()) ||
                                                s.position.toLowerCase().includes(companyName.toLowerCase())
                                            )
                                            .map((suggestion, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                                                    onClick={() => handleSelectCompany(suggestion.company, suggestion.position)}
                                                >
                                                    <Image
                                                        src={suggestion.logo}
                                                        alt={`${suggestion.company} logo`}
                                                        width={40}
                                                        height={40}
                                                        className="rounded-full"
                                                    />
                                                    <div>
                                                        <p className="font-medium">{suggestion.company}</p>
                                                        <p className="text-sm text-gray-500">{suggestion.position}</p>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                )}
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
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-3">

                                        <div>
                                            <p className="text-sm">Improve Experiences Description</p>
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
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-3">

                                        <div>
                                            <p className="text-sm">Enhance Description</p>
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
    )
}

export default UploadButton