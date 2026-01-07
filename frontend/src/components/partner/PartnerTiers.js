import { Check } from "lucide-react";
import { Button } from "../ui/button";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../translations";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";

export function PartnerTiers() {
  const { language } = useLanguage();
  const t = translations[language].partner.tiers;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    socialPlatform: "",
    socialMedia: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    // 表单验证
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.socialPlatform || !formData.socialMedia) {
      toast.error(
        language === 'en' ? 'Please fill in all fields' :
        language === 'es' ? 'Por favor completa todos los campos' :
        language === 'zh-TW' ? '請填寫所有欄位' : '请填写所有字段'
      );
      return;
    }

    try {
      setSubmitting(true);
      // 去重检查: 同邮箱 + 平台是否已存在
      const { data: existing, error: existingError } = await supabase
        .from('partner_applications')
        .select('id')
        .eq('email', formData.email)
        .eq('social_platform', formData.socialPlatform)
        .limit(1);
      if (existingError) {
        console.warn('Duplicate check error:', existingError.message);
      }
      if (existing && existing.length) {
        toast.error(
          language === 'en' ? 'You already applied with this platform.' :
          language === 'es' ? 'Ya aplicaste con esta plataforma.' :
          language === 'zh-TW' ? '此平台已提交過申請。' : '该平台已经提交过申请。'
        );
        return;
      }

      const insertPayload = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        social_platform: formData.socialPlatform,
        social_account: formData.socialMedia.trim(),
        status: 'pending'
      };

      const { error: insertError } = await supabase
        .from('partner_applications')
        .insert(insertPayload);

      if (insertError) {
        console.error('Insert error:', insertError);
        toast.error(
          language === 'en' ? 'Submission failed, please retry.' :
          language === 'es' ? 'Error al enviar, inténtalo de nuevo.' :
          language === 'zh-TW' ? '提交失敗，請重試。' : '提交失败，请重试。'
        );
        return;
      }

      toast.success(
        language === 'en' ? 'Application submitted successfully!' :
        language === 'es' ? '¡Solicitud enviada con éxito!' :
        language === 'zh-TW' ? '申請提交成功！' : '申请提交成功！'
      );

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        socialPlatform: "",
        socialMedia: "",
      });
      setIsDialogOpen(false);
    } catch (err) {
      console.error('Unexpected submit error:', err);
      toast.error(
        language === 'en' ? 'Unexpected error.' :
        language === 'es' ? 'Error inesperado.' :
        language === 'zh-TW' ? '發生未預期錯誤。' : '发生未预期错误。'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formLabels = {
    en: {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      socialPlatform: 'Social Media Platform',
      socialMedia: 'Social Media Account',
      submit: 'Submit Application',
      dialogTitle: 'Apply as Affiliate Partner',
      dialogDescription: 'Fill in your information to become an affiliate partner.',
      platformPlaceholder: 'Select a platform',
    },
    ja: {
      firstName: '名',
      lastName: '姓',
      email: 'メール',
      phone: '電話番号',
      socialPlatform: 'ソーシャルプラットフォーム',
      socialMedia: 'ソーシャルアカウント',
      submit: '申請を送信',
      dialogTitle: 'パートナーに応募',
      dialogDescription: 'パートナー登録のための情報を入力してください。',
      platformPlaceholder: 'プラットフォームを選択',
    },
    'zh-CN': {
      firstName: '名',
      lastName: '姓',
      email: '邮箱',
      phone: '电话',
      socialPlatform: '社交平台',
      socialMedia: '社交账号',
      submit: '提交申请',
      dialogTitle: '申请成为合作伙伴',
      dialogDescription: '填写你的信息以成为合作伙伴。',
      platformPlaceholder: '选择平台',
    },
    'zh-TW': {
      firstName: '名',
      lastName: '姓',
      email: '電子郵件',
      phone: '電話',
      socialPlatform: '社交平台',
      socialMedia: '社交帳號',
      submit: '提交申請',
      dialogTitle: '申請成為合作夥伴',
      dialogDescription: '填寫你的資訊以成為合作夥伴。',
      platformPlaceholder: '選擇平台',
    },
    es: {
      firstName: 'Nombre',
      lastName: 'Apellido',
      email: 'Correo electrónico',
      phone: 'Teléfono',
      socialPlatform: 'Plataforma de redes sociales',
      socialMedia: 'Cuenta de redes sociales',
      submit: 'Enviar solicitud',
      dialogTitle: 'Solicitar como Socio Afiliado',
      dialogDescription: 'Completa tu información para convertirte en socio afiliado.',
      platformPlaceholder: 'Seleccionar plataforma',
    },
  };

  const labels = formLabels[language];

  return (
    <section id="partner-contact" className="py-24 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl mb-4 text-white tracking-tight">
            {t.title}
          </h2>
        </div>

        {/* 鍗曚釜鍗＄墖灞呬腑鏄剧ず */}
        <div className="max-w-xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm p-8 transition-all hover:border-white/20">
            <div className="mb-6">
              <h3 className="text-2xl mb-2 text-white">{t.affiliate.name}</h3>
              {t.affiliate.price && (
                <p className="text-3xl text-[#22c55e] mb-4">{t.affiliate.price}</p>
              )}
              <p className="text-[#9ca3af] text-sm leading-relaxed">{t.affiliate.description}</p>
            </div>

            <Button
              onClick={() => setIsDialogOpen(true)}
              className="w-full mb-6 rounded-full py-6 bg-white/5 border border-white/10 text-white hover:bg-white/10"
            >
              {t.affiliate.cta}
            </Button>

            <ul className="space-y-3">
              {t.affiliate.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#22c55e] shrink-0 mt-0.5" />
                  <span className="text-[#9ca3af] text-sm leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-center text-[#9ca3af] mt-8 text-sm">
          {t.customDeals}
        </p>
      </div>

      {/* 鐢宠寮圭獥 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-[#0f172a] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">{labels.dialogTitle}</DialogTitle>
            <DialogDescription className="text-[#9ca3af]">
              {labels.dialogDescription}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white">{labels.firstName}</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-[#9ca3af] focus:border-[#4f46e5]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white">{labels.lastName}</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-[#9ca3af] focus:border-[#4f46e5]"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">{labels.email}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-[#9ca3af] focus:border-[#4f46e5]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">{labels.phone}</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-[#9ca3af] focus:border-[#4f46e5]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="socialPlatform" className="text-white">{labels.socialPlatform}</Label>
              <Select
                value={formData.socialPlatform}
                onValueChange={(value) => handleInputChange('socialPlatform', value)}
                required
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-[#4f46e5]">
                  <SelectValue placeholder={labels.platformPlaceholder} />
                </SelectTrigger>
                <SelectContent className="bg-[#1e293b] border-white/10">
                  <SelectItem value="tiktok" className="text-white focus:bg-white/10 focus:text-white">TikTok</SelectItem>
                  <SelectItem value="instagram" className="text-white focus:bg-white/10 focus:text-white">Instagram</SelectItem>
                  <SelectItem value="youtube" className="text-white focus:bg-white/10 focus:text-white">YouTube</SelectItem>
                  <SelectItem value="facebook" className="text-white focus:bg-white/10 focus:text-white">Facebook</SelectItem>
                  <SelectItem value="twitter" className="text-white focus:bg-white/10 focus:text-white">Twitter/X</SelectItem>
                  <SelectItem value="linkedin" className="text-white focus:bg-white/10 focus:text-white">LinkedIn</SelectItem>
                  <SelectItem value="xiaohongshu" className="text-white focus:bg-white/10 focus:text-white">小红书</SelectItem>
                  <SelectItem value="weibo" className="text-white focus:bg-white/10 focus:text-white">寰崥</SelectItem>
                  <SelectItem value="other" className="text-white focus:bg-white/10 focus:text-white">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="socialMedia" className="text-white">{labels.socialMedia}</Label>
              <Input
                id="socialMedia"
                value={formData.socialMedia}
                onChange={(e) => handleInputChange('socialMedia', e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-[#9ca3af] focus:border-[#4f46e5]"
                placeholder="@username"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-[#4f46e5] to-[#ec4899] disabled:opacity-50 hover:from-[#4338ca] hover:to-[#db2777] text-white rounded-full py-6 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 transition-all"
            >
              {submitting ? (
                language === 'en' ? 'Submitting...' :
                language === 'es' ? 'Enviando...' :
                language === 'zh-TW' ? '提交中...' : '提交中...'
              ) : labels.submit}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
