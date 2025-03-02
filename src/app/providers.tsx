'use client';

import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = React.useState(false);

    // Wait until after client-side hydration to show the UI
    React.useEffect(() => {
        setMounted(true);
    }, []);

    // If not mounted yet, render a simple loading state or nothing
    if (!mounted) {
        return <div className="p-8 flex justify-center">Loading...</div>;
    }

    return <>{children}</>;
}