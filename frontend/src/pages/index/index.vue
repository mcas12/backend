<template>
  <view class="container">
    <view class="upload-card">
      <view 
        class="upload-area"
        @click="triggerUpload"
        :class="{ 'uploading': isUploading }"
      >
        <uni-icons type="plus" size="36" color="#666" />
        <text class="upload-tip">{{ uploadStatusText }}</text>
      </view>
      
      <button 
        class="primary-btn"
        :disabled="!fileList.length || isSubmitting"
        @click="handleSubmit"
      >
        {{ isSubmitting ? '提交中...' : '提交批阅' }}
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const fileList = ref<File[]>([])
const isUploading = ref(false)
const isSubmitting = ref(false)
const uploadStatusText = ref('点击上传作业图片')
const fileInput = ref<HTMLInputElement | null>(null)

const triggerUpload = () => {
  if (!fileInput.value) {
    fileInput.value = document.createElement('input')
    fileInput.value.type = 'file'
    fileInput.value.accept = 'image/*'
    fileInput.value.multiple = false
    fileInput.value.onchange = handleFileSelect
  }
  fileInput.value.click()
}

const handleFileSelect = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (!files?.length) return

  isUploading.value = true
  uploadStatusText.value = '上传中...'

  try {
    const formData = new FormData()
    formData.append('image', files[0])  // 将字段名从'file'改为'image'

    const { data } = await axios.post('http://localhost:3000/api/review', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    fileList.value.push(files[0])
    uni.showToast({ title: '上传成功', icon: 'success' })
  } catch (err) {
    uni.showToast({ title: '上传失败', icon: 'none' })
  } finally {
    isUploading.value = false
    uploadStatusText.value = '点击上传作业图片'
  }
}

const handleSubmit = async () => {
  if (!fileList.value.length) return

  isSubmitting.value = true
  try {
    uni.showLoading({ title: '正在批阅...', mask: true })
    // 这里可以添加额外的提交逻辑
    uni.showToast({ title: '提交成功', icon: 'success' })
  } catch (err) {
    uni.showToast({ title: '提交失败', icon: 'none' })
  } finally {
    isSubmitting.value = false
    uni.hideLoading()
  }
}
</script>

<style lang="scss">
.container {
  padding: 24rpx;
  background: #f5f5f5;
  min-height: 100vh;
}

.upload-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.03);
}

.upload-area {
  @apply flex flex-col items-center justify-center;
  height: 320rpx;
  border: 2rpx dashed #ddd;
  border-radius: 12rpx;
  background: #fafafa;
  transition: all 0.2s;

  &.uploading {
    border-color: #2979ff;
    background: rgba(41, 121, 255, 0.05);
  }
}

.upload-tip {
  color: #666;
  font-size: 28rpx;
  margin-top: 16rpx;
}

.primary-btn {
  @apply w-full text-center mt-32rpx;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 40rpx;
  background: #2979ff;
  color: white;
  font-size: 32rpx;

  &[disabled] {
    background: #ccc;
    opacity: 0.7;
  }
}
</style>