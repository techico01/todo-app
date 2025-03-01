import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        router.push('/todos');
    }, [router]);

    return (
        <div className="flex justify-center items-center h-screen">
            <p>Redirecting to todos...</p>
        </div>
    );
}