    public function rules()
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'type' => ['nullable', 'string', 'max:100'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'owner_type_id' => ['nullable', 'integer', 'exists:owner_types,id'],
        ];
    }
