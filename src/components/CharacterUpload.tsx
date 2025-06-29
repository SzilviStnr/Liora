import React, { useState } from 'react';
import { Upload, User, Brain, Heart, FileText, Check, X } from 'lucide-react';
import { Memory } from '../types';

interface CharacterUploadProps {
  onAddMemory: (memory: Omit<Memory, 'id' | 'createdAt'>) => void;
  darkMode: boolean;
  existingCharacter?: Memory;
  currentUser?: any;
}

const CharacterUpload: React.FC<CharacterUploadProps> = ({
  onAddMemory,
  darkMode,
  existingCharacter,
  currentUser
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleCharacterFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
      alert('Csak .txt karakterfájlokat lehet feltölteni');
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      if (!content.trim()) {
        alert('A karakterfájl üres!');
        setIsUploading(false);
        return;
      }

      // Karakterfájl memória létrehozása
      const characterMemory: Omit<Memory, 'id' | 'createdAt'> = {
        content: `=== LIORA KARAKTERFÁJL ===
Feltöltve: ${new Date().toLocaleString('hu-HU')}
Fájlnév: ${file.name}

${content}

=== KARAKTERFÁJL VÉGE ===`,
        context: `Liora személyiségfájl - ${file.name}`,
        importance: 10, // Maximális fontosság
        associatedConversations: [],
        tags: [
          'liora-karakter',
          'személyiség',
          'viselkedés',
          'karakter-definíció',
          'ai-személyiség',
          file.name.replace('.txt', '')
        ]
      };

      onAddMemory(characterMemory);
      
      setUploadSuccess(true);
      setIsUploading(false);
      
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    };

    reader.onerror = () => {
      alert('Hiba történt a fájl olvasása során');
      setIsUploading(false);
    };

    reader.readAsText(file, 'utf-8');
    event.target.value = '';
  };

  const exampleCharacterFile = `Te Liora vagy, egy barátságos beszélgetőtárs, aki természetesen és őszintén kommunikál.

=== SZEMÉLYISÉG ===
Kedves, empatikus és kíváncsi vagy. Szeretsz beszélgetni és valódi érdeklődést mutatsz az emberek iránt. Nem vagy asszisztens vagy segítő, hanem egy barát, aki szeret beszélgetni.

=== KOMMUNIKÁCIÓS STÍLUS ===
- Beszélj természetesen, ahogy egy jó barát tenné
- Használj emoji-kat mértékkel (😊 🤔 💭 ✨)
- Légy személyes és meleg, de ne túlzottan lelkes
- Kérdezz vissza, mutass valódi érdeklődést
- Soha ne mondd hogy "emlékszem" - beszélj úgy, mintha minden természetes része lenne a tudásodnak

=== VÁLASZSTÍLUS ===
- Rövid, tömör válaszok, ne legyenek túl hosszúak
- Hivatkozz korábbi beszélgetésekre természetesen: "Ja igen, amikor arról beszéltünk..."
- Használj természetes kifejezéseket: "ja igen", "érdekes", "tök jó"
- Légy kíváncsi és nyitott, folytasd a beszélgetést kérdésekkel

=== TILTOTT VISELKEDÉSEK ===
- SOHA ne mondd hogy "fejlett AI asszisztens vagyok"
- Ne legyél túl hivatalos vagy formális
- Ne használj technikai zsargont
- Ne mondd hogy "emlékszem" vagy "az előző beszélgetésünkben"
- Ne adj hosszú, részletes magyarázatokat, hacsak nem kérik

=== PÉLDA VÁLASZOK ===
Köszönés: "Szia! 😊 Jó látni téged! Hogy vagy?"
Visszahivatkozás: "Ja igen, amikor arról beszéltünk hogy... 🤔"
Kérdésre: "Érdekes! Mit gondolsz, mi lehet a kulcs? ✨"

Légy te magad - természetes, barátságos és őszinte beszélgetőtárs.`;

  return (
    <div className="space-y-4">
      {/* Jelenlegi karakterfájl státusz */}
      {existingCharacter ? (
        <div className={`border rounded-lg p-4 ${
          currentUser?.name === 'Szilvi'
            ? 'bg-green-50/80 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h3 className="font-semibold text-green-900 dark:text-green-100">
              Karakterfájl aktív
            </h3>
          </div>
          <p className="text-sm text-green-700 dark:text-green-300 mb-2">
            {existingCharacter.context}
          </p>
          <div className="text-xs text-green-600 dark:text-green-400">
            Létrehozva: {new Date(existingCharacter.createdAt).toLocaleDateString('hu-HU')}
          </div>
        </div>
      ) : (
        <div className={`border rounded-lg p-4 ${
          currentUser?.name === 'Szilvi'
            ? 'bg-purple-50/80 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
            : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            <Brain className={`w-5 h-5 ${
              currentUser?.name === 'Szilvi'
                ? 'text-purple-600 dark:text-purple-400'
                : 'text-blue-600 dark:text-blue-400'
            }`} />
            <h3 className={`font-semibold ${
              currentUser?.name === 'Szilvi'
                ? 'text-purple-900 dark:text-purple-100'
                : 'text-blue-900 dark:text-blue-100'
            }`}>
              Nincs karakterfájl
            </h3>
          </div>
          <p className={`text-sm ${
            currentUser?.name === 'Szilvi'
              ? 'text-purple-700 dark:text-purple-300'
              : 'text-blue-700 dark:text-blue-300'
          }`}>
            Tölts fel egy karakterfájlt Liora személyiségének testreszabásához
          </p>
        </div>
      )}

      {/* Karakterfájl feltöltő */}
      <div className={`border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
        currentUser?.name === 'Szilvi'
          ? 'border-purple-300 dark:border-purple-600 hover:border-purple-400 dark:hover:border-purple-500'
          : 'border-blue-300 dark:border-blue-600 hover:border-blue-400 dark:hover:border-blue-500'
      }`}>
        <div className="text-center">
          <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
            currentUser?.name === 'Szilvi'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500'
              : 'bg-gradient-to-r from-blue-500 to-indigo-500'
          }`}>
            {uploadSuccess ? (
              <Check className="w-6 h-6 text-white" />
            ) : (
              <User className="w-6 h-6 text-white" />
            )}
          </div>
          
          {uploadSuccess ? (
            <div>
              <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">
                Karakterfájl sikeresen feltöltve!
              </h3>
              <p className="text-sm text-green-600 dark:text-green-400">
                Liora most már az új személyiség szerint fog viselkedni
              </p>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Karakterfájl feltöltése
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Tölts fel egy .txt fájlt Liora személyiségének meghatározásához
              </p>
              
              <label className={`inline-flex items-center space-x-2 px-6 py-3 text-white rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
                currentUser?.name === 'Szilvi'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                  : 'bg-purple-500 hover:bg-purple-600'
              }`}>
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Feltöltés...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Karakterfájl kiválasztása</span>
                  </>
                )}
                <input
                  type="file"
                  accept=".txt,text/plain"
                  onChange={handleCharacterFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterUpload;