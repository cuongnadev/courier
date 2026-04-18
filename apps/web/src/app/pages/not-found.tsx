import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 px-4 text-center">
            <h1 className="text-7xl font-extrabold text-gray-800">404</h1>

            <h2 className="mt-4 text-2xl font-semibold text-gray-700">
                Trang không tồn tại
            </h2>

            <p className="mt-2 max-w-md text-gray-500">
                Đường dẫn bạn truy cập không hợp lệ hoặc đã bị xoá.
            </p>

            <div className="mt-6 flex gap-3">
                <Button asChild>
                    <Link to="/">Về trang chủ</Link>
                </Button>

                <Button variant="outline" onClick={() => window.history.back()}>
                    Quay lại
                </Button>
            </div>
        </div>
    );
}