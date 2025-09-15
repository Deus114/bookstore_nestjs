import { Injectable } from '@nestjs/common';

@Injectable()
export class ErrorMessageService {
  private readonly messages = {
    vi: {
      // HTTP Status Codes
      '400': 'Yêu cầu không hợp lệ',
      '401': 'Không có quyền truy cập',
      '403': 'Bị cấm truy cập',
      '404': 'Không tìm thấy tài nguyên',
      '409': 'Xung đột dữ liệu',
      '422': 'Dữ liệu không hợp lệ',
      '500': 'Lỗi máy chủ nội bộ',

      // Business Error Codes
      USER_NOT_FOUND: 'Không tìm thấy người dùng',
      INVALID_CREDENTIALS: 'Thông tin đăng nhập không đúng',
      EMAIL_ALREADY_EXISTS: 'Email đã tồn tại',
      PHONE_ALREADY_EXISTS: 'Số điện thoại đã tồn tại',
      BOOK_NOT_FOUND: 'Không tìm thấy sách',
      CATEGORY_NOT_FOUND: 'Không tìm thấy danh mục',
      ORDER_NOT_FOUND: 'Không tìm thấy đơn hàng',
      INVALID_PASSWORD: 'Mật khẩu không đúng',
      INVALID_REFRESH_TOKEN: 'Refresh token không hợp lệ, vui lòng đăng nhập',
      INVALID_TOKEN: 'Token không hợp lệ hoặc không có Token ở Header!',
      CATEGORY_SLUG_EXISTS: 'Slug đã tồn tại',

      // Success Messages
      'user.create.success': 'Tạo mới người dùng thành công',
      'user.bulk_create.success': 'Tạo mới nhiều người dùng thành công',
      'user.get.success': 'Lấy dữ liệu thành công',
      'user.update.success': 'Cập nhật người dùng thành công',
      'user.delete.success': 'Xóa người dùng thành công',
      'user.change_password.success': 'Cập nhật mật khẩu thành công',
      'book.create.success': 'Tạo mới sách thành công',
      'book.get.success': 'Lấy dữ liệu thành công',
      'category.get.success': 'Lấy danh sách categories thành công',
      'category.get_one.success': 'Lấy thông tin category thành công',
      'category.create.success': 'Tạo category thành công',
      'category.update.success': 'Cập nhật category thành công',
      'category.delete.success': 'Xóa category thành công',
      'auth.login.success': 'Đăng nhập thành công',
      'auth.register.success': 'Đăng kí thành công',
      'auth.get_profile.success': 'Lấy thông tin người dùng thành công',
      'auth.refresh_token.success': 'Lấy thông tin người dùng từ refresh token',
      'auth.logout.success': 'Đăng xuất thành công',
      'file.upload.success': 'Upload Single File',
    },
    en: {
      // HTTP Status Codes
      '400': 'Bad Request',
      '401': 'Unauthorized',
      '403': 'Forbidden',
      '404': 'Not Found',
      '409': 'Conflict',
      '422': 'Unprocessable Entity',
      '500': 'Internal Server Error',

      // Business Error Codes
      USER_NOT_FOUND: 'User not found',
      INVALID_CREDENTIALS: 'Invalid credentials',
      EMAIL_ALREADY_EXISTS: 'Email already exists',
      PHONE_ALREADY_EXISTS: 'Phone already exists',
      BOOK_NOT_FOUND: 'Book not found',
      CATEGORY_NOT_FOUND: 'Category not found',
      ORDER_NOT_FOUND: 'Order not found',
      INVALID_PASSWORD: 'Invalid password',
      INVALID_REFRESH_TOKEN: 'Invalid refresh token, please login again',
      INVALID_TOKEN: 'Invalid token or no token in header!',
      CATEGORY_SLUG_EXISTS: 'Slug already exists',

      // Success Messages
      'user.create.success': 'Create user successfully',
      'user.bulk_create.success': 'Create multiple users successfully',
      'user.get.success': 'Get data successfully',
      'user.update.success': 'Update user successfully',
      'user.delete.success': 'Delete user successfully',
      'user.change_password.success': 'Change password successfully',
      'book.create.success': 'Create book successfully',
      'book.get.success': 'Get data successfully',
      'category.get.success': 'Get categories successfully',
      'category.get_one.success': 'Get category successfully',
      'category.create.success': 'Create category successfully',
      'category.update.success': 'Update category successfully',
      'category.delete.success': 'Delete category successfully',
      'auth.login.success': 'Login successfully',
      'auth.register.success': 'Register successfully',
      'auth.get_profile.success': 'Get user profile successfully',
      'auth.refresh_token.success': 'Get user from refresh token successfully',
      'auth.logout.success': 'Logout successfully',
      'file.upload.success': 'Upload Single File',
    },
  };

  getMessage(errorCode: string, language: string = 'vi'): string {
    const lang = language.startsWith('en') ? 'en' : 'vi';
    return this.messages[lang][errorCode] || this.messages[lang]['500'];
  }

  getHttpMessage(statusCode: number, language: string = 'vi'): string {
    const errorCode = statusCode.toString();
    return this.getMessage(errorCode, language);
  }

  getSuccessMessage(messageKey: string, language: string = 'vi'): string {
    const lang = language.startsWith('en') ? 'en' : 'vi';
    return this.messages[lang][messageKey] || messageKey;
  }
}
