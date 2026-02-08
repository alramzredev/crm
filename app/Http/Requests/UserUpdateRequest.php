<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class UserUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'first_name' => ['required', 'max:50'],
            'last_name' => ['required', 'max:50'],
            'email' => [
                'required',
                'max:50',
                'email',
                Rule::unique('users', 'email')->ignore($this->route('user')->id)
            ],
            'phone' => ['nullable', 'string', 'max:50'],
            'password' => ['nullable'],
            'role' => ['nullable', 'exists:roles,id'],
            'photo' => ['nullable', 'image'],
            'supervisor_ids' => ['nullable', 'array'],
            'supervisor_ids.*' => ['exists:users,id'],
            'project_ids' => ['nullable', 'array'],
            'project_ids.*' => ['exists:projects,id'],
        ];
    }
}
