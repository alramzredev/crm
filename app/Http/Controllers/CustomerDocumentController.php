<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\DocumentType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class CustomerDocumentController extends Controller
{
    public function upload(Request $request, Customer $customer, $document)
    {
        $this->authorize('update', $customer);

        $request->validate([
            'file' => 'required|file|max:10240', // 10MB max
        ]);

        // $document is the document type code (string)
        $documentType = DocumentType::where('code', $document)->firstOrFail();

      

        // Remove old media if exists for this document type
        $oldMedia = $customer->getMedia($documentType->code)->first();
        if ($oldMedia) {
            $oldMedia->delete();
        }

        // Add new media to the collection named after the document type code
        
     $media = $customer
    ->addMediaFromRequest('file')
    ->withCustomProperties([
        'status' => 'pending',
        'uploaded_by' => Auth::id(),
    ])
    ->usingFileName($request->file('file')->getClientOriginalName())
    ->toMediaCollection($documentType->code, 'public');

        return back()->with('success', 'Document uploaded successfully.');
    }

    public function destroy(Customer $customer, $document)
    {
        $this->authorize('update', $customer);

        // $document is the media id
        $media = $customer->media()->where('id', $document)->firstOrFail();
        $media->delete();

        return back()->with('success', 'Document file deleted.');
    }

    public function approve(Customer $customer, $document)
    {
        $this->authorize('update', $customer);

        // $document is the media id
        $media = $customer->media()->where('id', $document)->firstOrFail();

        // Set status to approved
        $media->setCustomProperty('status', 'approved');
        $media->save();

        return back()->with('success', 'Document approved successfully.');
    }
}
