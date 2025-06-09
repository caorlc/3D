"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

interface CredentialResponse {
  credential: string;
}

const GoogleOneTap = () => {
  const supabase = createClient();
  const router = useRouter();

  // Nonce 生成函数保持不变，非常棒
  const generateNonce = async (): Promise<string[]> => {
    const nonce = btoa(
      String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))
    );
    const encoder = new TextEncoder();
    const encodedNonce = encoder.encode(nonce);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encodedNonce);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedNonce = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return [nonce, hashedNonce];
  };

  useEffect(() => {
    // 定义一个异步函数来执行所有设置逻辑
    const setupGoogleOneTap = async () => {
      try {
        // 1. 检查会话，如果已登录则提前退出
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          return;
        }

        // 2. 检查 window.google 对象是否存在。由于脚本策略是 beforeInteractive，
        //    它应该在 useEffect 运行时就可用了。
        if (!window.google) {
          console.error("Google GSI script not loaded.");
          return;
        }

        // 3. 生成 Nonce
        const [nonce, hashedNonce] = await generateNonce();

        // 4. 初始化 Google One Tap
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          callback: async (response: CredentialResponse) => {
            try {
              const { error } = await supabase.auth.signInWithIdToken({
                provider: "google",
                token: response.credential,
                nonce, // 提供原始 nonce
              });

              if (error) throw error;

              router.refresh(); // 登录成功后刷新页面状态
            } catch (error) {
              console.error("Error in One Tap callback:", error);
            }
          },
          nonce: hashedNonce, // 提供哈希后的 nonce
          use_fedcm_for_prompt: true,
        });

        // 5. 显示弹窗
        window.google.accounts.id.prompt();
      } catch (error) {
        console.error("Error setting up Google One Tap:", error);
      }
    };

    setupGoogleOneTap();

    // 清理函数只负责取消 prompt
    return () => {
      // 确保 window.google 对象存在再调用 cancel
      if (window.google) {
        window.google.accounts.id.cancel();
      }
    };
  }, [router, supabase]); // 添加依赖项，符合 React Hooks 规则

  // 如果脚本已移至 layout.js，这里就不再需要 <Script> 标签
  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      strategy="afterInteractive"
    />
  );
};

export default GoogleOneTap;
