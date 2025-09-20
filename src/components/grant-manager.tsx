"use client";

import { useState, useRef } from 'react';
import type { GrantProgramDetails } from '@/ai/flows/match-sme-with-grant-programs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUp, Loader2, ArrowLeft, ArrowRight, List } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface GrantManagerProps {
    programs: GrantProgramDetails[];
    onAnalyze: (file: File) => Promise<void>;
    onNext: () => void;
    onBack: () => void;
    error: string | null;
}

export function GrantManager({ programs, onAnalyze, onNext, onBack, error }: GrantManagerProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIsUploading(true);
            setUploadError(null);
            try {
                await onAnalyze(file);
            } catch (err) {
                setUploadError(err instanceof Error ? err.message : "An unknown error occurred.");
            } finally {
                setIsUploading(false);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
            }
        }
    }

    const triggerFileIput = () => {
      fileInputRef.current?.click();
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="font-headline text-4xl font-bold tracking-tight">Grant Programs</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Review the list of available grants or upload a PDF to add a new one.
                </p>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <FileUp className="h-6 w-6 text-primary"/>
                           Upload New Grant
                        </CardTitle>
                        <CardDescription>Upload a PDF document of a grant program to add it to the list.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col items-center justify-center text-center p-6">
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            className="hidden"
                            ref={fileInputRef}
                            disabled={isUploading}
                        />
                        <Button onClick={triggerFileIput} disabled={isUploading} size="lg">
                            {isUploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <FileUp className="mr-2 h-4 w-4" />
                                    Choose PDF
                                </>
                            )}
                        </Button>
                        {uploadError && <p className="mt-2 text-sm text-destructive">{uploadError}</p>}
                        <p className="mt-4 text-xs text-muted-foreground">Only PDF files are accepted.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <List className="h-6 w-6 text-primary"/>
                            Available Programs
                        </CardTitle>
                        <CardDescription>A total of {programs.length} programs are ready for matching.</CardDescription>
                    </CardHeader>
                    <CardContent className="max-h-60 overflow-y-auto pr-2">
                        <ul className="space-y-2">
                            {programs.map((program, index) => (
                                <li key={index} className="text-sm p-2 bg-secondary rounded-md">
                                    {program.programName}
                                </li>
                            ))}
                             {programs.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No programs available yet. Upload a PDF to get started.</p>}
                        </ul>
                    </CardContent>
                </Card>
            </div>
            
            <div className="mt-8 flex justify-between items-center">
                <Button variant="outline" onClick={onBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={onNext} disabled={programs.length === 0}>
                    Find My Matches <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
