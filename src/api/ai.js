// src/api/ai.js
import request from '@/utils/request'

/**
 * 提交简答题答案进行 AI 评估
 * @param {Object} payload - 包含题目 ID 和用户答案
 */
const evaluateAnswer = async (payload) => {
  try {
    const response = await fetch('/api/v1/ai/evaluate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // 获取流并进行逐字处理
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done, value;
    let fullText = '';

    while (!done) {
      ({ done, value } = await reader.read());
      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;
      // You can handle your text streaming logic here, e.g., display chunk by chunk
    }

    return fullText;  // Or process the text further
  } catch (error) {
    console.error('AI 评估失败', error);
    throw new Error('AI 评估失败：' + error.message);
  }
}

export default {
  evaluateAnswer
}
