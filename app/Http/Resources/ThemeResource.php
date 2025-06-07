<?php
// app/Http/Resources/ThemeResource.php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ThemeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'sections' => $this->sections, // Hanya kirim parsed sections
            'background_image_url' => $this->background_image_url,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            
            // Conditional fields - hanya kirim jika diperlukan
            $this->mergeWhen($request->routeIs('themes.edit'), [
                'preview_image_path' => $this->preview_image_path,
                'view_name' => $this->view_name,
            ]),
        ];
    }
}