import React from 'react';
import { X, Printer } from 'lucide-react';
import { Project, SimCard } from '../types';

interface InvoiceModalProps {
  project: Project;
  simCards: SimCard[];
  onClose: () => void;
}

export function InvoiceModal({ project, simCards, onClose }: InvoiceModalProps) {
  const totalMonthlyCost = simCards.reduce((sum, sim) => sum + sim.monthlyCost, 0);
  const totalAnnualCost = totalMonthlyCost * 12;
  const currentDate = new Date().toLocaleDateString('ar-SA');
  const invoiceNumber = `INV-${project.id}-${Date.now().toString().slice(-6)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">فاتورة المشروع</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Printer className="w-5 h-5" />
              <span>طباعة الفاتورة</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-8" id="printable-invoice">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <img
                src="https://e.top4top.io/p_3231azaak1.png"
                alt="Company Logo"
                className="h-16 w-auto mb-4"
              />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">فاتورة</h1>
              <p className="text-gray-600">رقم الفاتورة: {invoiceNumber}</p>
              <p className="text-gray-600">التاريخ: {currentDate}</p>
            </div>
            <div className="text-left">
              <h2 className="font-semibold text-lg text-gray-800 mb-2">{project.name}</h2>
              <p className="text-gray-600">{project.branch}</p>
              <p className="text-gray-600">
                تاريخ البداية: {new Date(project.startDate).toLocaleDateString('ar-SA')}
              </p>
              {project.endDate && (
                <p className="text-gray-600">
                  تاريخ النهاية: {new Date(project.endDate).toLocaleDateString('ar-SA')}
                </p>
              )}
            </div>
          </div>

          {/* Invoice Details */}
          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-3 text-right">رقم الشريحة</th>
                  <th className="py-3 text-right">نوع الخدمة</th>
                  <th className="py-3 text-right">المزود</th>
                  <th className="py-3 text-right">التكلفة الشهرية</th>
                  <th className="py-3 text-right">التكلفة السنوية</th>
                </tr>
              </thead>
              <tbody>
                {simCards.map((sim) => (
                  <tr key={sim.id} className="border-b border-gray-100">
                    <td className="py-3">{sim.number}</td>
                    <td className="py-3">{sim.serviceType}</td>
                    <td className="py-3">{sim.provider}</td>
                    <td className="py-3">{sim.monthlyCost.toFixed(2)} ريال</td>
                    <td className="py-3">{(sim.monthlyCost * 12).toFixed(2)} ريال</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-200 font-semibold">
                  <td colSpan={3} className="py-4 text-left">المجموع</td>
                  <td className="py-4">{totalMonthlyCost.toFixed(2)} ريال</td>
                  <td className="py-4">{totalAnnualCost.toFixed(2)} ريال</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Invoice Footer */}
          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-2">ملاحظات</h3>
                <p className="text-gray-600 text-sm">
                  - جميع الأسعار تشمل ضريبة القيمة المضافة
                  <br />
                  - يتم تجديد الاشتراك تلقائياً ما لم يتم إلغاؤه
                  <br />
                  - للاستفسارات يرجى التواصل مع خدمة العملاء
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">معلومات الدفع</h3>
                <p className="text-gray-600 text-sm">
                  يرجى تحويل المبلغ إلى الحساب البنكي:
                  <br />
                  البنك: البنك الأهلي السعودي
                  <br />
                  رقم الحساب: SA0000000000000000
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            size: A4;
            margin: 2cm;
          }
        }
      `}</style>
    </div>
  );
}