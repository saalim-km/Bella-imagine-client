import React , {Component , ErrorInfo , ReactNode} from "react";

interface ErrorBoundaryProps {
    children : ReactNode;
}

interface ErrorBoundaryState {
    hasError : boolean;
}


class ErrorBoundary extends Component<ErrorBoundaryProps , ErrorBoundaryState> {
    constructor(props : ErrorBoundaryProps) {
        super(props);
        this.state = {hasError : false}
    }

    static getDerivedStateFromError(_: Error): ErrorBoundaryState {
        // Update state to display the fallback UI on the next render.
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error(`error cought  by errorBoundary ${error} ,this  component throw the error :  pettan ready aaktta ${errorInfo}`);
    }

    render(): ReactNode {
        if(this.state.hasError) {
            return <h1>Something went wrong , please check out console for more info.</h1>
        }

        return this.props.children;
    }
}

export default ErrorBoundary