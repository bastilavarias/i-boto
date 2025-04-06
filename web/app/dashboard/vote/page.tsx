import { MainLayout } from '@/layouts/main-layout';
import { Ballot } from '@/components/balllot';

export default function HomePage() {
    return (
        <MainLayout>
            <Ballot />
        </MainLayout>
    );
}
