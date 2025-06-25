<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\InvitationTheme;

class InvitationThemeController extends Controller
{
    public function index()
    {
        $themes = InvitationTheme::all();
        return Inertia::render('Themes/Index', [
            'themes' => $themes
        ]);
    }

    public function edit($slug)
    {
        $theme = InvitationTheme::where('slug', $slug)->firstOrFail();

        $theme->sections = json_decode($theme->sections_json, true);
        $theme->theme_config = json_decode($theme->theme_config, true);

        $theme->background_image_url = asset("storage" . $theme->background_image_path);

        return Inertia::render('Themes/Editor', [
            'theme' => $theme,
            'storage_path' => asset('storage')
        ]);
    }

    public function updateSection(Request $request, $themeId, $index)
    {
        $theme = InvitationTheme::findOrFail($themeId);
        $sections = json_decode($theme->sections_json, true);

        // Validasi yang diperluas untuk mendukung semua tipe element
        $request->validate([
            'fieldName' => 'required|string',
            'data' => 'required|array',

            // Properti umum
            'data.type' => 'nullable|string|in:wrapper,text,image,button,video,iframe,form,input,select,textarea,list',
            'data.order' => 'nullable|integer',
            'data.animation' => 'nullable|string',

            // Content properties
            'data.text' => 'nullable|string',
            'data.path' => 'nullable|string',
            'data.src' => 'nullable|string',
            'data.href' => 'nullable|string',
            'data.target' => 'nullable|string|in:_self,_blank,_parent,_top',
            'data.onClick' => 'nullable|string',
            'data.alt' => 'nullable|string',
            'data.title' => 'nullable|string',

            // Form properties
            'data.action' => 'nullable|string',
            'data.method' => 'nullable|string|in:GET,POST,PUT,DELETE,PATCH',
            'data.name' => 'nullable|string',
            'data.id' => 'nullable|string',
            'data.placeholder' => 'nullable|string',
            'data.required' => 'nullable|boolean',
            'data.inputType' => 'nullable|string',
            'data.rows' => 'nullable|integer|min:1',
            'data.options' => 'nullable|array',
            'data.options.*.value' => 'nullable|string',
            'data.options.*.label' => 'nullable|string',

            // Video properties
            'data.controls' => 'nullable|boolean',
            'data.autoPlay' => 'nullable|boolean',
            'data.muted' => 'nullable|boolean',
            'data.loop' => 'nullable|boolean',
            'data.allowFullScreen' => 'nullable|boolean',

            // List properties
            'data.ordered' => 'nullable|boolean',
            'data.items' => 'nullable|array',

            // Style objects
            'data.textStyle' => 'nullable|array',
            'data.imageStyle' => 'nullable|array',
            'data.wrapperStyle' => 'nullable|array',
            'data.buttonStyle' => 'nullable|array',
            'data.videoStyle' => 'nullable|array',
            'data.iframeStyle' => 'nullable|array',
            'data.formStyle' => 'nullable|array',
            'data.inputStyle' => 'nullable|array',
            'data.selectStyle' => 'nullable|array',
            'data.textareaStyle' => 'nullable|array',
            'data.listStyle' => 'nullable|array',
            'data.itemStyle' => 'nullable|array',
        ]);

        $fieldName = $request->input('fieldName');
        $data = $request->input('data');

        if (isset($sections[$index])) {
            $cleanData = $this->prepareElementData($data);

            // Navigasi ke nested element menggunakan fieldName
            $fieldParts = explode('.', $fieldName);
            $current = &$sections[$index];

            // Traverse ke parent element
            for ($i = 0; $i < count($fieldParts) - 1; $i++) {
                if (!isset($current[$fieldParts[$i]])) {
                    $current[$fieldParts[$i]] = [];
                }
                $current = &$current[$fieldParts[$i]];
            }

            // Update final element
            $finalKey = end($fieldParts);
            if (!isset($current[$finalKey])) {
                $current[$finalKey] = [];
            }

            // Merge dengan data yang sudah ada (untuk mempertahankan properti lain)
            $current[$finalKey] = array_merge($current[$finalKey], $cleanData);
        } else {
            return back()->with('error', 'Section not found!');
        }

        $theme->sections_json = json_encode($sections, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $theme->save();

        return back()->with('success', ucfirst($fieldName) . ' updated successfully!');
    }

    /**
     * Prepare and clean element data for all supported element types
     */
    private function prepareElementData(array $data): array
    {
        $cleanData = [];

        // 1. Properti umum untuk semua element
        if (isset($data['type'])) {
            $cleanData['type'] = $data['type'];
        }

        if (isset($data['order'])) {
            $cleanData['order'] = (int) $data['order'];
        }

        if (isset($data['animation']) && !empty($data['animation'])) {
            $cleanData['animation'] = $data['animation'];
        }

        // 2. Content properties
        if (isset($data['text'])) {
            $cleanData['text'] = $data['text'];
        }

        if (isset($data['path'])) {
            $cleanData['path'] = $data['path'];
        }

        if (isset($data['src'])) {
            $cleanData['src'] = $data['src'];
        }

        if (isset($data['href'])) {
            $cleanData['href'] = $data['href'];
        }

        if (isset($data['target'])) {
            $cleanData['target'] = $data['target'];
        }

        if (isset($data['onClick'])) {
            $cleanData['onClick'] = $data['onClick'];
        }

        if (isset($data['alt'])) {
            $cleanData['alt'] = $data['alt'];
        }

        if (isset($data['title'])) {
            $cleanData['title'] = $data['title'];
        }

        // 3. Form properties
        if (isset($data['action'])) {
            $cleanData['action'] = $data['action'];
        }

        if (isset($data['method'])) {
            $cleanData['method'] = $data['method'];
        }

        if (isset($data['name'])) {
            $cleanData['name'] = $data['name'];
        }

        if (isset($data['id'])) {
            $cleanData['id'] = $data['id'];
        }

        if (isset($data['placeholder'])) {
            $cleanData['placeholder'] = $data['placeholder'];
        }

        if (isset($data['required'])) {
            $cleanData['required'] = (bool) $data['required'];
        }

        if (isset($data['inputType'])) {
            $cleanData['inputType'] = $data['inputType'];
        }

        if (isset($data['rows'])) {
            $cleanData['rows'] = (int) $data['rows'];
        }

        if (isset($data['options']) && is_array($data['options'])) {
            $cleanData['options'] = $data['options'];
        }

        // 4. Video properties
        if (isset($data['controls'])) {
            $cleanData['controls'] = (bool) $data['controls'];
        }

        if (isset($data['autoPlay'])) {
            $cleanData['autoPlay'] = (bool) $data['autoPlay'];
        }

        if (isset($data['muted'])) {
            $cleanData['muted'] = (bool) $data['muted'];
        }

        if (isset($data['loop'])) {
            $cleanData['loop'] = (bool) $data['loop'];
        }

        if (isset($data['allowFullScreen'])) {
            $cleanData['allowFullScreen'] = (bool) $data['allowFullScreen'];
        }

        // 5. List properties
        if (isset($data['ordered'])) {
            $cleanData['ordered'] = (bool) $data['ordered'];
        }

        if (isset($data['items']) && is_array($data['items'])) {
            $cleanData['items'] = $data['items'];
        }

        // 6. Style objects - semua tipe style yang didukung
        $styleTypes = [
            'textStyle',
            'imageStyle',
            'wrapperStyle',
            'buttonStyle',
            'videoStyle',
            'iframeStyle',
            'formStyle',
            'inputStyle',
            'selectStyle',
            'textareaStyle',
            'listStyle',
            'itemStyle'
        ];

        foreach ($styleTypes as $styleType) {
            if (isset($data[$styleType]) && is_array($data[$styleType])) {
                $cleanData[$styleType] = $data[$styleType];
            }
        }

        return $cleanData;
    }

    public function show($slug)
    {
        $theme = InvitationTheme::where('slug', $slug)->firstOrFail();
        $theme->sections = json_decode($theme->sections_json, true);
        $theme->theme_config = json_decode($theme->theme_config, true);
        $theme->background_image_url = asset("storage" . $theme->background_image_path);

        return Inertia::render('Themes/Show', [
            'theme' => $theme,
            'storage_path' => asset('storage')
        ]);
    }

    /**
     * Add new element to a section
     */
    public function addSection(Request $request, $themeId)
    {
        $theme = InvitationTheme::findOrFail($themeId);
        $sections = json_decode($theme->sections_json, true) ?? [];

        $request->validate([
            'type' => 'required|string',
            'minHeight' => 'nullable|string',
            'wrapperStyle' => 'nullable|array',
        ]);

        // Create new section
        $newSection = [
            'type' => $request->input('type'),
            'minHeight' => $request->input('minHeight', '100vh'),
            'wrapperStyle' => $request->input('wrapperStyle', [
                'position' => 'relative',
                'overflow' => 'hidden'
            ])
        ];

        // Add to sections array
        $sections[] = $newSection;

        // Save to database
        $theme->sections_json = json_encode($sections, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $theme->save();

        return back()->with('success', 'Section added successfully!');
    }

    /**
     * Add new element to section
     */
    public function addElement(Request $request, $themeId, $sectionIndex)
    {
        $theme = InvitationTheme::findOrFail($themeId);
        $sections = json_decode($theme->sections_json, true) ?? [];

        $request->validate([
            'parentPath' => 'nullable|string',
            'elementKey' => 'required|string',
            'elementData' => 'required|array',
        ]);

        if (!isset($sections[$sectionIndex])) {
            return back()->with('error', 'Section not found!');
        }

        $parentPath = $request->input('parentPath');
        $elementKey = $request->input('elementKey');
        $elementData = $this->prepareElementData($request->input('elementData'));

        if ($parentPath) {
            // Add to nested element
            $pathParts = explode('.', $parentPath);
            $current = &$sections[$sectionIndex];

            foreach ($pathParts as $part) {
                if (!isset($current[$part])) {
                    $current[$part] = [];
                }
                $current = &$current[$part];
            }

            $current[$elementKey] = $elementData;
        } else {
            // Add to section root
            $sections[$sectionIndex][$elementKey] = $elementData;
        }

        // Save to database
        $theme->sections_json = json_encode($sections, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $theme->save();

        return back()->with('success', 'Element added successfully!');
    }

    /**
     * Delete section
     */
    public function deleteSection(Request $request, $themeId, $sectionIndex)
    {
        $theme = InvitationTheme::findOrFail($themeId);
        $sections = json_decode($theme->sections_json, true) ?? [];

        if (!isset($sections[$sectionIndex])) {
            return back()->with('error', 'Section not found!');
        }

        // Remove section
        array_splice($sections, $sectionIndex, 1);

        // Save to database
        $theme->sections_json = json_encode($sections, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $theme->save();

        return back()->with('success', 'Section deleted successfully!');
    }

    /**
     * Delete element from a section
     */
    public function deleteElement(Request $request, $themeId, $sectionIndex)
    {
        $theme = InvitationTheme::findOrFail($themeId);
        $sections = json_decode($theme->sections_json, true) ?? [];

        $request->validate([
            'parentPath' => 'nullable|string',
            'elementKey' => 'required|string',
        ]);

        if (!isset($sections[$sectionIndex])) {
            return back()->with('error', 'Section not found!');
        }

        $parentPath = $request->input('parentPath');
        $elementKey = $request->input('elementKey');

        if ($parentPath) {
            // Delete from nested element
            $pathParts = explode('.', $parentPath);
            $current = &$sections[$sectionIndex];

            foreach ($pathParts as $part) {
                if (!isset($current[$part])) {
                    return back()->with('error', 'Parent element not found!');
                }
                $current = &$current[$part];
            }

            if (!isset($current[$elementKey])) {
                return back()->with('error', 'Element not found!');
            }

            // Delete element (cascade delete children automatically)
            unset($current[$elementKey]);
        } else {
            // Delete from section root
            if (!isset($sections[$sectionIndex][$elementKey])) {
                return back()->with('error', 'Element not found!');
            }

            // Delete element (cascade delete children automatically)
            unset($sections[$sectionIndex][$elementKey]);
        }

        // Save to database
        $theme->sections_json = json_encode($sections, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $theme->save();

        return back()->with('success', 'Element deleted successfully!');
    }
}
