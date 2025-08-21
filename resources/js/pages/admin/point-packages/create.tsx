import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';

export default function CreatePointPackage() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    points: '',
    price: '',
    bonus_points: '0',
    is_active: true,
    is_featured: false,
    features: ['']
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Filter out empty features
    const cleanedForm = {
      ...form,
      features: form.features.filter(feature => feature.trim() !== '')
    };

    router.post('/admin/point-packages', cleanedForm, {
      onSuccess: () => {
        // Redirect handled by controller
      },
      onError: () => {
        setIsSubmitting(false);
      },
      onFinish: () => setIsSubmitting(false),
    });
  };

  const updateForm = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const addFeature = () => {
    setForm(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const removeFeature = (index: number) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  return (
    <AppLayout>
      <Head title="Buat Paket Poin Baru" />
      
      <div className="space-y-6 p-6">
        <div className="flex flex-col gap-4">
          <Button
            variant="outline"
            onClick={() => router.get('/admin/point-packages')}
            className="w-fit"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Paket Poin
          </Button>
          <h1 className="text-2xl font-bold">Buat Paket Poin Baru</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Paket</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Nama Paket</label>
                    <Input
                      value={form.name}
                      onChange={(e) => updateForm('name', e.target.value)}
                      placeholder="contoh: Paket Business"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Deskripsi</label>
                    <Textarea
                      value={form.description}
                      onChange={(e) => updateForm('description', e.target.value)}
                      placeholder="Jelaskan keunggulan dan target paket ini..."
                      required
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Jumlah Poin Utama</label>
                      <Input
                        type="number"
                        value={form.points}
                        onChange={(e) => updateForm('points', e.target.value)}
                        placeholder="contoh: 15"
                        required
                        className="mt-1"
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Bonus Poin</label>
                      <Input
                        type="number"
                        value={form.bonus_points}
                        onChange={(e) => updateForm('bonus_points', e.target.value)}
                        placeholder="contoh: 3"
                        className="mt-1"
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Harga</label>
                    <CurrencyInput
                      value={form.price}
                      onChange={(value) => updateForm('price', value)}
                      placeholder="135.000"
                      className="mt-1"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Poin yang dibeli tidak akan kadaluarsa</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Features</label>
                    <div className="space-y-2">
                      {form.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={feature}
                            onChange={(e) => updateFeature(index, e.target.value)}
                            placeholder="contoh: 15 credit posting lowongan"
                            className="flex-1"
                          />
                          {form.features.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeFeature(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addFeature}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Feature
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_active"
                        checked={form.is_active}
                        onCheckedChange={(checked) => updateForm('is_active', checked)}
                      />
                      <label htmlFor="is_active" className="text-sm font-medium">
                        Paket Aktif
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_featured"
                        checked={form.is_featured}
                        onCheckedChange={(checked) => updateForm('is_featured', checked)}
                      />
                      <label htmlFor="is_featured" className="text-sm font-medium">
                        Paket Featured
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Total Poin:</span>
                    <p className="font-semibold">
                      {(parseInt(form.points) || 0) + (parseInt(form.bonus_points) || 0)} poin
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-600">Harga per Poin:</span>
                    <p className="font-semibold">
                      {form.price && form.points ? 
                        `Rp ${Math.round(parseInt(form.price) / ((parseInt(form.points) || 0) + (parseInt(form.bonus_points) || 0))).toLocaleString('id-ID')}` 
                        : 'Rp 0'}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-600">Masa Berlaku:</span>
                    <p className="font-semibold text-green-600">Permanen</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Aksi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Paket'}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.get('/admin/point-packages')}
                  >
                    Batal
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tips</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600 space-y-2">
                  <p><strong>Penetapan Harga:</strong></p>
                  <p>• Paket lebih besar = harga per poin lebih murah</p>
                  <p>• Berikan bonus poin untuk paket premium</p>
                  
                  <div className="mt-3 pt-3 border-t">
                    <p><strong>Features:</strong></p>
                    <p>• Jelaskan benefit yang didapat</p>
                    <p>• Cantumkan dukungan yang tersedia</p>
                    <p>• Sebutkan fitur khusus</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}