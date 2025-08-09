<?php

namespace App\Http\Requests\Settings;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            
            // Profile fields
            'first_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'location' => ['nullable', 'string', 'max:255'],
            'avatar' => ['nullable', 'image', 'max:2048'], // 2MB max
            'resume' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:5120'], // 5MB max
            'portfolio_url' => ['nullable', 'url', 'max:255'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
            'github_url' => ['nullable', 'url', 'max:255'],
            'current_position' => ['nullable', 'string', 'max:255'],
            'expected_salary_min' => ['nullable', 'numeric', 'min:0'],
            'expected_salary_max' => ['nullable', 'numeric', 'min:0', 'gte:expected_salary_min'],
            'salary_currency' => ['nullable', 'string', 'in:IDR,USD,EUR,SGD'],
            'open_to_work' => ['boolean'],
        ];
    }
}
