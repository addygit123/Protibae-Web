import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { AutoPrint } from '@/components/admin/AutoPrint';

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      address: true,
      payment: true,
      items: {
        include: {
          product: true
        }
      }
    }
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-black p-8 font-sans print:p-0">
      <div className="max-w-[800px] mx-auto bg-white p-10 print:p-0 shadow-2xl print:shadow-none">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-gray-200 pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">PROTIBAE</h1>
            <p className="text-gray-500 mt-2 text-sm">Performance Nutrition</p>
            <p className="text-gray-500 text-sm">123 Fitness Avenue, Mumbai 400001</p>
            <p className="text-gray-500 text-sm font-semibold mt-1">GSTIN: 27AADCP1234E1Z5</p>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold text-gray-300 uppercase tracking-widest mb-2">TAX INVOICE</h2>
            <p className="font-semibold text-gray-900">Invoice #: <span className="font-normal">{order.orderNumber}</span></p>
            <p className="font-semibold text-gray-900">Date: <span className="font-normal">{new Date(order.createdAt).toLocaleDateString()}</span></p>
            <p className="font-semibold text-gray-900">Status: <span className="font-normal uppercase">{order.status}</span></p>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-2 gap-12 mb-10">
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Billed To:</h3>
            <p className="font-bold text-gray-900 text-lg">{order.user.name}</p>
            <p className="text-gray-600">{order.user.email}</p>
            <p className="text-gray-600 mt-1">{order.address.phone}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Shipped To:</h3>
            <p className="text-gray-800 font-medium">{order.address.firstName} {order.address.lastName}</p>
            <p className="text-gray-600">{order.address.street}</p>
            <p className="text-gray-600">{order.address.city}, {order.address.state} {order.address.zip}</p>
            <p className="text-gray-600">{order.address.country}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-900 text-sm">
                <th className="py-3 font-bold text-gray-900 uppercase tracking-wider">Item Description</th>
                <th className="py-3 font-bold text-gray-900 uppercase tracking-wider text-center">Qty</th>
                <th className="py-3 font-bold text-gray-900 uppercase tracking-wider text-right">Unit Price</th>
                <th className="py-3 font-bold text-gray-900 uppercase tracking-wider text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-4">
                    <p className="font-semibold text-gray-900">{item.product.name}</p>
                  </td>
                  <td className="py-4 text-center text-gray-800">{item.quantity}</td>
                  <td className="py-4 text-right text-gray-800">₹{item.price.toFixed(2)}</td>
                  <td className="py-4 text-right font-semibold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-16">
          <div className="w-1/2">
            <div className="flex justify-between py-2 text-gray-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-gray-900">₹{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 text-gray-600">
              <span>Shipping:</span>
              <span className="font-semibold text-gray-900">₹{order.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 text-gray-600 border-b border-gray-200">
              <span>Tax (GST Included):</span>
              <span className="font-semibold text-gray-900">₹{order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-4 text-xl">
              <span className="font-bold text-gray-900 uppercase tracking-wide">Total Amount:</span>
              <span className="font-black text-gray-900">₹{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-8 text-center mb-8">
          <h4 className="font-bold text-gray-900 tracking-wide uppercase mb-2">Thank you for your business!</h4>
          <p className="text-gray-500 text-sm">For any inquiries, please contact support@protibae.com</p>
        </div>
        
        {/* Print Automation */}
        <AutoPrint />
      </div>
    </div>
  );
}
