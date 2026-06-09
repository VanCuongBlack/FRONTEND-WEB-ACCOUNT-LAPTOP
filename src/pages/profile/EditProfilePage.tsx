import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  getStoredUserProfile,
  saveUserProfile,
} from "@/utils/profileStorage";

const MAX_FILE_SIZE = 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

const PROVINCE_DISTRICT_MAP: Record<string, string[]> = {
  "Hồ Chí Minh": ["Quận 1", "Quận 3", "Quận 7", "Thủ Đức"],
  "Hà Nội": ["Ba Đình", "Cầu Giấy", "Đống Đa", "Hoàng Mai"],
  "Đà Nẵng": ["Hải Châu", "Sơn Trà", "Thanh Khê", "Ngũ Hành Sơn"],
  "Cần Thơ": ["Ninh Kiều", "Bình Thủy", "Cái Răng", "Ô Môn"],
};

export default function EditProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const savedProfile = getStoredUserProfile();

  const [fullName, setFullName] = useState(savedProfile.fullName);
  const [email, setEmail] = useState(savedProfile.email);
  const [phone, setPhone] = useState(savedProfile.phone);
  const [password, setPassword] = useState(savedProfile.password);
  const [showPassword, setShowPassword] = useState(false);
  const [address, setAddress] = useState(savedProfile.address);
  const [province, setProvince] = useState(savedProfile.province);
  const [district, setDistrict] = useState(savedProfile.district);
  const [avatarUrl, setAvatarUrl] = useState(savedProfile.avatarUrl);
  const [avatarError, setAvatarError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const validDistricts = PROVINCE_DISTRICT_MAP[province] ?? [];
    if (!validDistricts.includes(district)) {
      setDistrict(validDistricts[0] ?? "");
    }
  }, [province, district]);

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(selectedFile.type)) {
      setAvatarError("Chỉ hỗ trợ định dạng JPG/JPEG hoặc PNG.");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setAvatarError("Dung lượng ảnh tối đa là 1 MB.");
      event.target.value = "";
      return;
    }

    try {
      const nextAvatarUrl = await fileToDataUrl(selectedFile);
      setAvatarError("");
      setAvatarUrl(nextAvatarUrl);
    } catch {
      setAvatarError("Không thể đọc ảnh đã chọn, vui lòng thử lại.");
      event.target.value = "";
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    saveUserProfile({
      ...savedProfile,
      fullName,
      email,
      phone,
      password,
      address,
      province,
      district,
      avatarUrl,
    });

    setShowSuccessModal(true);
  };

  const districtOptions = PROVINCE_DISTRICT_MAP[province] ?? [];

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#F5F5F5] text-black">
      <Header pageLabel="Sửa Hồ Sơ" cartCount={2} />

      <main className="w-full max-w-[1000px] mx-auto py-6 px-4 flex-1">
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-200">
            <h1 className="text-[28px] font-bold text-gray-900">
              Hồ sơ của tôi
            </h1>

            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="h-[40px] px-4 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors text-[14px]"
            >
              Quay lại
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              <div className="flex-1 space-y-4">
                <FieldRow label="Họ và tên">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="w-full h-[48px] rounded-[18px] border border-gray-300 px-4 text-[16px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3783EC]/25 focus:border-[#3783EC]"
                    required
                  />
                </FieldRow>

                <FieldRow label="Email">
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full h-[48px] rounded-[18px] border border-gray-300 px-4 text-[16px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3783EC]/25 focus:border-[#3783EC]"
                    required
                  />
                </FieldRow>

                <FieldRow label="Số điện thoại">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="w-full h-[48px] rounded-[18px] border border-gray-300 px-4 text-[16px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3783EC]/25 focus:border-[#3783EC]"
                    required
                  />
                </FieldRow>

                <FieldRow label="Mật khẩu">
                  <div className="relative w-full h-[48px] flex items-center">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="w-full h-full rounded-[18px] border border-gray-300 pl-4 pr-11 text-[16px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3783EC]/25 focus:border-[#3783EC]"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 text-black/40 hover:text-black/70 transition-colors cursor-pointer p-1 flex items-center justify-center"
                      title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showPassword ? "👁" : "🙈"}
                    </button>
                  </div>
                </FieldRow>

                <FieldRow label="Địa chỉ giao hàng">
                  <input
                    type="text"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    className="w-full h-[76px] rounded-[18px] border border-gray-300 px-4 text-[16px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3783EC]/25 focus:border-[#3783EC]"
                    required
                  />
                </FieldRow>

                <FieldRow label="Tỉnh/ Thành Phố">
                  <select
                    value={province}
                    onChange={(event) => setProvince(event.target.value)}
                    className="w-full h-[48px] rounded-[18px] border border-gray-300 px-4 text-[16px] text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#3783EC]/25 focus:border-[#3783EC]"
                    required
                  >
                    {Object.keys(PROVINCE_DISTRICT_MAP).map((provinceName) => (
                      <option key={provinceName} value={provinceName}>
                        {provinceName}
                      </option>
                    ))}
                  </select>
                </FieldRow>

                <FieldRow label="Quận/ Huyện">
                  <select
                    value={district}
                    onChange={(event) => setDistrict(event.target.value)}
                    className="w-full h-[48px] rounded-[18px] border border-gray-300 px-4 text-[16px] text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#3783EC]/25 focus:border-[#3783EC]"
                    required
                  >
                    {districtOptions.map((districtName) => (
                      <option key={districtName} value={districtName}>
                        {districtName}
                      </option>
                    ))}
                  </select>
                </FieldRow>
              </div>

              <div className="lg:w-[260px] lg:pl-6 lg:border-l border-gray-200 flex flex-col items-center">
                <div className="w-[128px] h-[128px] rounded-full overflow-hidden bg-gray-200 border border-gray-300">
                  <img
                    src={avatarUrl}
                    alt="Ảnh đại diện"
                    className="w-full h-full object-cover"
                  />
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleAvatarChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-7 h-[48px] px-6 rounded-md border border-gray-300 text-[16px] font-medium text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  Chọn ảnh
                </button>

                <p className="mt-4 text-center text-[15px] leading-[1.4] text-gray-500">
                  Dung lượng file tối đa 1 MB
                  <br />
                  Định dạng: JPEG, PNG
                </p>

                {avatarError && (
                  <p className="mt-2 text-center text-sm text-red-500">
                    {avatarError}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="h-[44px] min-w-[110px] rounded-full bg-gray-300 px-6 text-[16px] font-semibold text-gray-700 hover:bg-[#3783EC] hover:text-white transition-colors"
              >
                Lưu
              </button>
            </div>
          </form>
        </section>
      </main>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-[500px] bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <svg
                className="w-10 h-10 text-green-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Cập nhật hồ sơ thành công
            </h2>

            <p className="text-gray-500 text-lg mb-6">
              Thông tin của bạn đã được cập nhật.
            </p>

            <div className="border-t border-gray-200 pt-6">
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate("/profile");
                }}
                className="px-10 py-3 bg-[#3783EC] text-white rounded-xl font-semibold hover:bg-blue-600 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

interface FieldRowProps {
  label: string;
  children: ReactNode;
}

function FieldRow({ label, children }: FieldRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[160px_minmax(0,1fr)] items-center gap-2 sm:gap-3">
      <label className="text-[17px] text-gray-900">{label}</label>
      {children}
    </div>
  );
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Invalid file result"));
    };

    reader.onerror = () =>
      reject(reader.error ?? new Error("Failed to read file"));

    reader.readAsDataURL(file);
  });
}