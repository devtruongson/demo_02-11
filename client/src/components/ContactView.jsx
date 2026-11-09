import {
    AlertCircle,
    CheckCircle2,
    Globe,
    Mail,
    MapPin,
    Navigation,
    RefreshCw,
    Send,
    ShieldCheck
} from 'lucide-react';
import { useState } from 'react';

function FacebookIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export default function ContactView() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    content: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // FAQ Accordion State (openIndex)
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const faqs = [
    {
      question: 'Ai có thể gửi câu chuyện & tư liệu?',
      answer: 'Mọi đoàn viên, thanh niên, giáo viên, học sinh và nhân dân đều có thể gửi bài thu hoạch, câu chuyện lịch sử hoặc đóng góp hình ảnh khảo cổ học. Nội dung do các cấp bộ Đoàn và Hội đồng Sư phạm tiếp nhận, kiểm chứng khoa học trước khi công bố.'
    },
    {
      question: 'Bao lâu thì câu chuyện được duyệt & phản hồi?',
      answer: 'Thông tin và tư liệu đóng góp sẽ được Hội đồng chuyên môn thẩm định trong vòng 24 - 48 giờ làm việc và phản hồi kết quả trực tiếp qua số điện thoại hoặc email mà bạn cung cấp.'
    },
    {
      question: 'Tư liệu gửi về được dùng thế nào?',
      answer: 'Các nguồn sử liệu và hình ảnh đạt chuẩn sẽ được thẩm định sư phạm, số hóa thành tư liệu chất lượng cao hoặc chuyển hóa thành mô hình 3D tương tác trên nền tảng Sử Ký Số, phục vụ miễn phí cho công tác giảng dạy Lịch sử 10 trên toàn quốc.'
    },
    {
      question: 'Tôi cần hỗ trợ kỹ thuật thì liên hệ đâu?',
      answer: 'Bạn có thể gửi yêu cầu hỗ trợ qua biểu mẫu bên trên hoặc liên hệ trực tiếp qua hotline kỹ thuật / email ban biên tập để được hỗ trợ hướng dẫn sử dụng và tích hợp bài giảng số 24/7.'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name.trim()) {
      setSubmitError('Vui lòng nhập họ và tên của bạn.');
      return;
    }
    if (!formData.phone.trim()) {
      setSubmitError('Vui lòng nhập số điện thoại để chúng tôi liên hệ lại.');
      return;
    }
    if (!formData.content.trim()) {
      setSubmitError('Vui lòng nhập nội dung tin nhắn liên hệ.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gửi liên hệ thất bại');
      }

      setSubmitSuccess(true);
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        content: ''
      });
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 7000);
    } catch (err) {
      setSubmitError(err.message || 'Lỗi kết nối máy chủ');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 sm:space-y-12 animate-fade-in max-w-5xl mx-auto pb-10">
      {/* ========================================================= */}
      {/* 1. TOP CARD: CONTACT INFO (LEFT) + FORM (RIGHT)           */}
      {/* ========================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Organization & Social Info */}
        <div className="lg:col-span-5 bg-stone-50/70 p-6 sm:p-8 lg:p-9 border-b lg:border-b-0 lg:border-r border-slate-200/80 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                Trung ương Đoàn TNCS Hồ Chí Minh
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                Ban Tổ chức Đề án "Câu chuyện thời hoa lửa" & Ban Biên tập Nền tảng Học liệu Số Lịch sử 10
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0 border border-rose-100">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-[10px] uppercase tracking-wider text-slate-400">
                    Địa chỉ
                  </span>
                  <span className="font-semibold text-slate-800 leading-relaxed block mt-0.5">
                    Số 60 Bà Triệu, Phường Cửa Nam, TP. Hà Nội
                  </span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0 border border-rose-100">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-[10px] uppercase tracking-wider text-slate-400">
                    Email
                  </span>
                  <a
                    href="mailto:tuyengiaotwd@gmail.com"
                    className="font-semibold text-slate-800 hover:text-rose-700 transition block mt-0.5"
                  >
                    tuyengiaotwd@gmail.com
                  </a>
                </div>
              </div>

              {/* Website */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0 border border-rose-100">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-[10px] uppercase tracking-wider text-slate-400">
                    Website
                  </span>
                  <a
                    href="https://doanthanhnien.vn"
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-slate-800 hover:text-rose-700 transition block mt-0.5"
                  >
                    doanthanhnien.vn
                  </a>
                </div>
              </div>

              {/* Facebook */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0 border border-rose-100">
                  <FacebookIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-[10px] uppercase tracking-wider text-slate-400">
                    Facebook
                  </span>
                  <a
                    href="https://www.facebook.com/trunguongdoan"
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-slate-800 hover:text-rose-700 transition block mt-0.5"
                  >
                    Cổng thông tin Trung ương Đoàn TNCS Hồ Chí Minh
                  </a>
                </div>
              </div>

              {/* TikTok */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0 border border-rose-100 font-black text-xs">
                  ♪
                </div>
                <div>
                  <span className="block font-bold text-[10px] uppercase tracking-wider text-slate-400">
                    TikTok
                  </span>
                  <span className="font-semibold text-slate-800 block mt-0.5">
                    Congtactuyengiao
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200/80 text-[11px] text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Kênh tiếp nhận & phản hồi chính thức của Đề án</span>
          </div>
        </div>

        {/* Right Column: Contact Submission Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-9 bg-white">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Gửi thông tin cho chúng tôi
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Điền vào biểu mẫu bên dưới, chúng tôi sẽ phản hồi sớm nhất.
            </p>
          </div>

          {submitSuccess && (
            <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-fade-in font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block text-sm">Gửi thông tin thành công!</strong>
                <span>Cảm ơn bạn đã liên hệ. Ban biên tập Sử Ký Số đã tiếp nhận thông tin và sẽ liên lạc lại trong thời gian sớm nhất.</span>
              </div>
            </div>
          )}

          {submitError && (
            <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-fade-in font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Field: Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Họ và tên <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Nhập họ và tên của bạn"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-700/20 focus:border-rose-700 transition placeholder-slate-400"
              />
            </div>

            {/* Field: Email */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Không bắt buộc – nhập nếu muốn nhận phản hồi qua email"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-700/20 focus:border-rose-700 transition placeholder-slate-400"
              />
            </div>

            {/* Field: Phone Number */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Số điện thoại <span className="text-rose-600">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Nhập số điện thoại để chúng tôi liên hệ lại"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-700/20 focus:border-rose-700 transition placeholder-slate-400"
              />
            </div>

            {/* Field: Content */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Nội dung <span className="text-rose-600">*</span>
              </label>
              <textarea
                rows={4}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Nhập nội dung tin nhắn, câu hỏi hoặc thông tin đóng góp tư liệu lịch sử..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-700/20 focus:border-rose-700 transition placeholder-slate-400 leading-relaxed resize-y"
              />
            </div>

            <p className="text-[11px] text-slate-500 leading-normal">
              Thông tin của bạn được bảo mật và chỉ sử dụng cho mục đích hỗ trợ, tiếp nhận câu chuyện lịch sử.
            </p>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8c1d24] hover:bg-[#72151b] text-white text-xs font-bold transition shadow-sm active:scale-95 cursor-pointer disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang gửi thông tin...</span>
                  </>
                ) : (
                  <>
                    <span>Gửi thông tin</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. FAQ ACCORDION SECTION                                  */}
      {/* ========================================================= */}
      <div className="space-y-6 !hidden">
        <div className="text-center">
          <h3 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">
            Câu hỏi thường gặp
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Giải đáp các thắc mắc phổ biến về quy trình tiếp nhận, thẩm định và số hóa học liệu
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/70 transition"
                >
                  <span className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                    {faq.question}
                  </span>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-rose-700 shrink-0 font-bold text-sm">
                    {isOpen ? '✕' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-fade-in font-normal">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. LOCATION & MAP SECTION                                 */}
      {/* ========================================================= */}
      <div className="space-y-4 !hidden">
        <div className="text-center">
          <h3 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">
            Địa chỉ của chúng tôi
          </h3>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col md:flex-row items-stretch">
          {/* Map Embed Container */}
          <div className="w-full md:w-3/5 min-h-[260px] sm:min-h-[300px] bg-slate-100 relative">
            <iframe
              title="Bản đồ vị trí Trung ương Đoàn TNCS Hồ Chí Minh"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.120689947963!2d105.84589947596956!3d21.027857187807755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab969966113b%3A0x633512803b9b4f6!2zNjAgQsOgIFRyaeG7h3UsIFRy4bqnbiBIxrBuZyDEkOG6oWksIEhvw6BuIEtp4bq_bSwgSMOgIE7hu5lpLCBWaWV0bmFt!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '260px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>

          {/* Location Info Card with "Chỉ đường" button */}
          <div className="w-full md:w-2/5 p-6 sm:p-8 flex flex-col justify-between bg-stone-50/60 border-t md:border-t-0 md:border-l border-slate-200/80 space-y-5">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs shrink-0 border border-rose-200">
                  🇻🇳
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 leading-snug">
                    Trung ương Đoàn TNCS Hồ Chí Minh
                  </h4>
                  <span className="text-[11px] text-slate-500 font-medium">Trụ sở cơ quan</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Số 60 Bà Triệu, Phường Cửa Nam (Trần Hưng Đạo), Quận Hoàn Kiếm, TP. Hà Nội
              </p>
            </div>

            <div>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=60+Bà+Triệu,+Hoàn+Kiếm,+Hà+Nội"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#8c1d24] hover:bg-[#72151b] text-white text-xs font-bold transition shadow-sm active:scale-95 cursor-pointer w-full sm:w-auto"
              >
                <span>Chỉ đường</span>
                <Navigation className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
