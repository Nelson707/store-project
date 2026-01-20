import Layout from "../../components/layout/layout";

export default function Home() {
    return (
        <Layout title="Dashboard" subtitle="Welcome back! Here's what's happening today.">
            <div className="flex items-center justify-center h-screen">
                <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
            </div>
        </Layout>
    );
}