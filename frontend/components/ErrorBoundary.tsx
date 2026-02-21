"use client";

import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { IconAlertTriangle, IconRefresh } from "@tabler/icons-react";

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error,
            errorInfo: null,
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({
            error,
            errorInfo,
        });

        // Log error to external service in production
        console.error("ErrorBoundary caught an error:", error, errorInfo);

        // Call custom error handler if provided
        this.props.onError?.(error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render() {
        if (this.state.hasError) {
            const { fallback: Fallback } = this.props;

            if (Fallback && this.state.error) {
                return <Fallback error={this.state.error} reset={this.handleReset} />;
            }

            return <DefaultErrorFallback error={this.state.error} reset={this.handleReset} />;
        }

        return this.props.children;
    }
}

// Default error fallback component
function DefaultErrorFallback({
    error,
    reset
}: {
    error: Error | null;
    reset: () => void;
}) {
    return (
        <Card className="max-w-xl mx-auto mt-8">
            <CardHeader>
                <Alert variant="destructive">
                    <IconAlertTriangle className="h-4 w-4" />
                    <AlertTitle>Something went wrong</AlertTitle>
                    <AlertDescription>
                        An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
                    </AlertDescription>
                </Alert>
            </CardHeader>

            <CardContent className="space-y-4">
                {error && process.env.NODE_ENV === "development" && (
                    <details className="text-sm">
                        <summary className="cursor-pointer font-medium">Error Details (Development)</summary>
                        <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto whitespace-pre-wrap">
                            {error.message}
                            {error.stack && `\n\nStack trace:\n${error.stack}`}
                        </pre>
                    </details>
                )}

                <div className="flex gap-2">
                    <Button onClick={reset} variant="outline" className="flex-1">
                        <IconRefresh className="h-4 w-4 mr-2" />
                        Try Again
                    </Button>

                    <Button
                        onClick={() => window.location.reload()}
                        variant="default"
                        className="flex-1"
                    >
                        Refresh Page
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

// Chart-specific error fallback
export function ChartErrorFallback({
    error,
    reset
}: {
    error: Error;
    reset: () => void;
}) {
    return (
        <div className="h-[300px] flex flex-col items-center justify-center border rounded-lg bg-muted/50">
            <IconAlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground text-center mb-4">
                Failed to load chart
            </p>
            <Button onClick={reset} variant="outline" size="sm">
                <IconRefresh className="h-4 w-4 mr-2" />
                Retry
            </Button>
        </div>
    );
}

export default ErrorBoundary;