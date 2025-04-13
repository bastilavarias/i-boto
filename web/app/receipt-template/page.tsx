import { MainLayout } from '@/layouts/main-layout'
import { VoteReceipt } from '@/components/vote-receipt'

export default function ReceiptPage() {
    return (
        <MainLayout>
            <VoteReceipt codes={[]} />
        </MainLayout>
    )
}
