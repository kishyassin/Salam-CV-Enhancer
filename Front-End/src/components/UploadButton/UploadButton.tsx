'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, FileText, ArrowRight, Loader2, Sparkles, Search } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import Image from 'next/image'
import Link from 'next/link'

const UploadButton = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [companyName, setCompanyName] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)

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
                            className="w-full bg-[#1098F7] text-white hover:bg-[#1098F7]/90"
                            size="lg"
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