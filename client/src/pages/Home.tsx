import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, FileText, Download, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import jsPDF from "jspdf";

interface FormData {
  comarca: string;
  autorNome: string;
  autorNacionalidade: string;
  autorEstadoCivil: string;
  autorProfissao: string;
  autorRG: string;
  autorCPF: string;
  autorEndereco: string;
  autorEmail: string;
  autorTelefone: string;
  acaoTipo: string;
  reuNome: string;
  reuQualificacao: string;
  reuCPFCNPJ: string;
  reuEndereco: string;
  reuEmail: string;
  reuTelefone: string;
  dataFato: string;
  descricaoFato1: string;
  descricaoFato2: string;
  descricaoFato3: string;
  dataAtentativa: string;
  meioAtentativa: string;
  respuestaReu: string;
  danosMateriais: string;
  danosMorais: string;
  violacaoDireito: string;
  condenacao: string;
  prova: string;
  tutela: string;
  tutelaMulta: string;
  valorCausa: string;
  cidade: string;
  mes: string;
  ano: string;
}

const NACIONALIDADES = ["Brasileira", "Portuguesa", "Italiana", "Espanhola", "Outra"];
const ESTADOS_CIVIS = ["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)", "União Estável"];
const TIPOS_ACAO = ["Cobrança", "Rescisão de Contrato", "Indenização por Danos Morais", "Devolução de Valores", "Reparação de Danos", "Outra"];

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    comarca: "",
    autorNome: "",
    autorNacionalidade: "",
    autorEstadoCivil: "",
    autorProfissao: "",
    autorRG: "",
    autorCPF: "",
    autorEndereco: "",
    autorEmail: "",
    autorTelefone: "",
    acaoTipo: "",
    reuNome: "",
    reuQualificacao: "",
    reuCPFCNPJ: "",
    reuEndereco: "",
    reuEmail: "",
    reuTelefone: "",
    dataFato: "",
    descricaoFato1: "",
    descricaoFato2: "",
    descricaoFato3: "",
    dataAtentativa: "",
    meioAtentativa: "",
    respuestaReu: "",
    danosMateriais: "",
    danosMorais: "",
    violacaoDireito: "",
    condenacao: "",
    prova: "",
    tutela: "",
    tutelaMulta: "",
    valorCausa: "",
    cidade: "",
    mes: "",
    ano: "",
  });

  const [openDialogs, setOpenDialogs] = useState<Record<string, boolean>>({});
  const [currentDialogField, setCurrentDialogField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [step, setStep] = useState(1);
  const [pdfGenerated, setPdfGenerated] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const openDialog = (field: string) => {
    setCurrentDialogField(field);
    setTempValue(formData[field as keyof FormData] as string);
    setOpenDialogs(prev => ({ ...prev, [field]: true }));
  };

  const closeDialog = () => {
    if (currentDialogField) {
      setOpenDialogs(prev => ({ ...prev, [currentDialogField]: false }));
    }
    setCurrentDialogField(null);
    setTempValue("");
  };

  const saveDialogValue = () => {
    if (currentDialogField && tempValue) {
      handleInputChange(currentDialogField as keyof FormData, tempValue);
      setOpenDialogs(prev => ({ ...prev, [currentDialogField]: false }));
      setCurrentDialogField(null);
      setTempValue("");
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Helper functions
    const addText = (text: string, fontSize: number, fontStyle: "normal" | "bold" = "normal", align: "left" | "center" = "left") => {
      doc.setFontSize(fontSize);
      if (fontStyle === "bold") doc.setFont("helvetica", "bold");
      else doc.setFont("helvetica", "normal");
      
      const lines = doc.splitTextToSize(text, contentWidth);
      doc.text(lines, margin, yPosition, { align });
      yPosition += lines.length * (fontSize / 2.5) + 3;
    };

    const addSpacing = (height: number = 5) => {
      yPosition += height;
    };

    const checkPageBreak = (minHeight: number = 20) => {
      if (yPosition + minHeight > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
    };

    // Header
    doc.setTextColor(25, 55, 109); // Azul escuro
    addText("EXCELENTÍSSIMO(A) SENHOR(A) JUIZ(A) DE DIREITO", 11, "bold", "center");
    addText(`DO JUIZADO ESPECIAL CÍVEL DA COMARCA DE ${formData.comarca.toUpperCase()}`, 11, "bold", "center");
    addSpacing(10);

    // Autor
    doc.setTextColor(0, 0, 0);
    addText(`${formData.autorNome}, ${formData.autorNacionalidade}, ${formData.autorEstadoCivil}, ${formData.autorProfissao}, portador(a) do RG nº ${formData.autorRG}, inscrito(a) no CPF nº ${formData.autorCPF}, residente e domiciliado(a) à ${formData.autorEndereco}, e-mail ${formData.autorEmail}, telefone ${formData.autorTelefone}, vem, respeitosamente, à presença de Vossa Excelência, propor a presente`, 10);
    addSpacing(8);

    // Tipo de ação
    doc.setTextColor(25, 55, 109);
    addText(`AÇÃO DE ${formData.acaoTipo.toUpperCase()}`, 11, "bold", "center");
    addSpacing(8);

    // Réu
    doc.setTextColor(0, 0, 0);
    addText(`em face de ${formData.reuNome}, ${formData.reuQualificacao}, inscrito(a) no CPF/CNPJ nº ${formData.reuCPFCNPJ}, com endereço em ${formData.reuEndereco}, e-mail ${formData.reuEmail}, telefone ${formData.reuTelefone}, pelos fatos e fundamentos a seguir expostos:`, 10);
    addSpacing(10);

    // Seção 1: Dos Fatos
    checkPageBreak(30);
    doc.setTextColor(25, 55, 109);
    addText("1. DOS FATOS", 11, "bold");
    addSpacing(5);

    doc.setTextColor(0, 0, 0);
    addText(`No dia ${formData.dataFato}, o(a) autor(a) ${formData.descricaoFato1}.`, 10);
    addSpacing(3);
    addText(`Ocorre que ${formData.descricaoFato2}`, 10);
    addSpacing(3);
    addText(formData.descricaoFato3, 10);
    addSpacing(3);
    addText(`Apesar das tentativas de solução administrativa realizadas em ${formData.dataAtentativa}, por meio de ${formData.meioAtentativa}, a parte ré ${formData.respuestaReu}.`, 10);
    addSpacing(3);
    addText("Em razão disso, o(a) autor(a) sofreu os seguintes prejuízos:", 10);
    addSpacing(3);
    addText(`• danos materiais no valor de R$ ${formData.danosMateriais};`, 10);
    addText(`• danos morais, em razão de ${formData.danosMorais}.`, 10);
    addSpacing(8);

    // Seção 2: Do Direito
    checkPageBreak(30);
    doc.setTextColor(25, 55, 109);
    addText("2. DO DIREITO", 11, "bold");
    addSpacing(5);

    doc.setTextColor(0, 0, 0);
    addText("A presente demanda é compatível com o procedimento do Juizado Especial Cível, por se tratar de causa de menor complexidade e de valor compatível com o rito previsto na Lei nº 9.099/1995.", 10);
    addSpacing(3);
    addText(`A conduta da parte ré configura ${formData.violacaoDireito}, violando direito do(a) autor(a).`, 10);
    addSpacing(3);
    addText("Quando aplicável, trata-se de relação de consumo, incidindo as normas do Código de Defesa do Consumidor, especialmente no que se refere à responsabilidade pela falha na prestação do serviço ou fornecimento do produto.", 10);
    addSpacing(3);
    addText(`Assim, a parte ré deve ser condenada a ${formData.condenacao}, uma vez que o(a) autor(a) comprovou ${formData.prova}.`, 10);
    addSpacing(8);

    // Seção 3: Dos Pedidos
    checkPageBreak(40);
    doc.setTextColor(25, 55, 109);
    addText("3. DOS PEDIDOS", 11, "bold");
    addSpacing(5);

    doc.setTextColor(0, 0, 0);
    addText("Diante do exposto, requer:", 10);
    addSpacing(3);
    addText("1. A citação da parte ré para comparecer à audiência de conciliação e, querendo, apresentar resposta, sob pena dos efeitos legais;", 10);
    addSpacing(2);
    addText("2. A total procedência da ação para condenar a parte ré a:", 10);
    addSpacing(2);
    addText(`a) pagar ao(à) autor(a) a quantia de R$ ${formData.danosMateriais}, a título de danos materiais;`, 10);
    addText(`b) pagar ao(à) autor(a) a quantia de R$ ${formData.danosMorais}, a título de danos morais;`, 10);
    addText(`c) cumprir a obrigação de fazer/não fazer consistente em ${formData.tutela};`, 10);
    addSpacing(2);
    addText("3. A inversão do ônus da prova, quando cabível;", 10);
    addSpacing(2);
    addText("4. A produção de todas as provas admitidas em direito, especialmente documental, testemunhal e depoimento pessoal da parte ré;", 10);
    addSpacing(2);
    addText("5. A incidência de correção monetária e juros legais;", 10);
    addSpacing(2);
    addText(`6. A concessão de tutela de urgência, se cabível, para determinar que a parte ré ${formData.tutela}, sob pena de multa diária de R$ ${formData.tutelaMulta}.`, 10);
    addSpacing(8);

    // Seção 4: Do Valor da Causa
    checkPageBreak(20);
    doc.setTextColor(25, 55, 109);
    addText("4. DO VALOR DA CAUSA", 11, "bold");
    addSpacing(5);

    doc.setTextColor(0, 0, 0);
    addText(`Dá-se à causa o valor de R$ ${formData.valorCausa}.`, 10);
    addSpacing(10);

    addText("Termos em que,", 10);
    addText("Pede deferimento.", 10);
    addSpacing(15);

    addText(`${formData.cidade}, ${formData.mes} de ${formData.ano}.`, 10, "normal", "center");
    addSpacing(15);

    doc.setFont("helvetica", "bold");
    addText("_".repeat(40), 10, "normal", "center");
    addText(`${formData.autorNome}`, 10, "normal", "center");
    addText(`CPF nº ${formData.autorCPF}`, 10, "normal", "center");
    addSpacing(10);

    // Documentos anexos
    doc.setTextColor(25, 55, 109);
    addText("DOCUMENTOS ANEXOS", 11, "bold");
    addSpacing(5);

    doc.setTextColor(0, 0, 0);
    addText("1. Documento de identidade e CPF;", 10);
    addText("2. Comprovante de residência;", 10);
    addText("3. Contrato, nota fiscal ou comprovante de pagamento;", 10);
    addText("4. Conversas, e-mails, protocolos de atendimento;", 10);
    addText("5. Prints, fotos, laudos e demais documentos pertinentes.", 10);

    // Salvar PDF
    doc.save("peticao-juizado.pdf");
    setPdfGenerated(true);
  };

  const isStep1Complete = formData.comarca && formData.autorNome && formData.autorCPF && formData.autorEmail;
  const isStep2Complete = formData.reuNome && formData.reuCPFCNPJ && formData.acaoTipo;
  const isStep3Complete = formData.descricaoFato1 && formData.danosMateriais && formData.valorCausa;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Gerador de Petição</h1>
          </div>
          <p className="text-blue-100">Juizado Especial Cível - Preencha os dados para gerar sua petição em PDF</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* LGPD Alert */}
        <Alert className="mb-8 border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-900" />
          <AlertDescription className="text-blue-900">
            <strong>Conformidade LGPD:</strong> Os dados pessoais que você preencher neste formulário <strong>não serão armazenados</strong> em nenhum servidor. O PDF é gerado localmente no seu navegador e você tem total controle sobre o arquivo. Nenhuma informação é enviada para terceiros.
          </AlertDescription>
        </Alert>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex flex-col items-center flex-1">
                <button
                  onClick={() => setStep(s)}
                  className={`w-10 h-10 rounded-full font-bold flex items-center justify-center mb-2 transition-all ${
                    s === step
                      ? "bg-blue-900 text-white"
                      : s < step
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {s < step ? <CheckCircle2 className="w-6 h-6" /> : s}
                </button>
                <span className="text-sm font-medium text-gray-700">
                  {s === 1 ? "Dados Pessoais" : s === 2 ? "Dados do Réu" : "Descrição do Caso"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Sections */}
        <div className="space-y-6">
          {/* Step 1: Dados Pessoais */}
          {step === 1 && (
            <Card className="border-2 border-blue-200">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-blue-900">Dados Pessoais do Autor</CardTitle>
                <CardDescription>Preencha suas informações pessoais</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Comarca *</label>
                    <Input
                      placeholder="Ex: São Paulo"
                      value={formData.comarca}
                      onChange={(e) => handleInputChange("comarca", e.target.value)}
                      className="border-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
                    <Input
                      placeholder="Seu nome"
                      value={formData.autorNome}
                      onChange={(e) => handleInputChange("autorNome", e.target.value)}
                      className="border-blue-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nacionalidade</label>
                    <button
                      onClick={() => openDialog("autorNacionalidade")}
                      className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white text-left hover:bg-blue-50 transition"
                    >
                      {formData.autorNacionalidade || "Selecione..."}
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado Civil</label>
                    <button
                      onClick={() => openDialog("autorEstadoCivil")}
                      className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white text-left hover:bg-blue-50 transition"
                    >
                      {formData.autorEstadoCivil || "Selecione..."}
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profissão</label>
                    <Input
                      placeholder="Ex: Advogado"
                      value={formData.autorProfissao}
                      onChange={(e) => handleInputChange("autorProfissao", e.target.value)}
                      className="border-blue-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">RG</label>
                    <Input
                      placeholder="Número do RG"
                      value={formData.autorRG}
                      onChange={(e) => handleInputChange("autorRG", e.target.value)}
                      className="border-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CPF *</label>
                    <Input
                      placeholder="000.000.000-00"
                      value={formData.autorCPF}
                      onChange={(e) => handleInputChange("autorCPF", e.target.value)}
                      className="border-blue-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                  <Input
                    placeholder="Rua, número, complemento"
                    value={formData.autorEndereco}
                    onChange={(e) => handleInputChange("autorEndereco", e.target.value)}
                    className="border-blue-300"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">E-mail *</label>
                    <Input
                      type="email"
                      placeholder="seu.email@exemplo.com"
                      value={formData.autorEmail}
                      onChange={(e) => handleInputChange("autorEmail", e.target.value)}
                      className="border-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                    <Input
                      placeholder="(11) 99999-9999"
                      value={formData.autorTelefone}
                      onChange={(e) => handleInputChange("autorTelefone", e.target.value)}
                      className="border-blue-300"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!isStep1Complete}
                    className="bg-blue-900 hover:bg-blue-800"
                  >
                    Próximo
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Dados do Réu */}
          {step === 2 && (
            <Card className="border-2 border-blue-200">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-blue-900">Dados do Réu</CardTitle>
                <CardDescription>Preencha os dados da parte ré</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Ação *</label>
                    <button
                      onClick={() => openDialog("acaoTipo")}
                      className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white text-left hover:bg-blue-50 transition"
                    >
                      {formData.acaoTipo || "Selecione..."}
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Réu *</label>
                    <Input
                      placeholder="Nome completo ou razão social"
                      value={formData.reuNome}
                      onChange={(e) => handleInputChange("reuNome", e.target.value)}
                      className="border-blue-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qualificação</label>
                  <Input
                    placeholder="Ex: Pessoa física, Empresa"
                    value={formData.reuQualificacao}
                    onChange={(e) => handleInputChange("reuQualificacao", e.target.value)}
                    className="border-blue-300"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CPF/CNPJ *</label>
                    <Input
                      placeholder="000.000.000-00 ou 00.000.000/0000-00"
                      value={formData.reuCPFCNPJ}
                      onChange={(e) => handleInputChange("reuCPFCNPJ", e.target.value)}
                      className="border-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                    <Input
                      placeholder="Rua, número, complemento"
                      value={formData.reuEndereco}
                      onChange={(e) => handleInputChange("reuEndereco", e.target.value)}
                      className="border-blue-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                    <Input
                      type="email"
                      placeholder="email@exemplo.com"
                      value={formData.reuEmail}
                      onChange={(e) => handleInputChange("reuEmail", e.target.value)}
                      className="border-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                    <Input
                      placeholder="(11) 99999-9999"
                      value={formData.reuTelefone}
                      onChange={(e) => handleInputChange("reuTelefone", e.target.value)}
                      className="border-blue-300"
                    />
                  </div>
                </div>

                <div className="flex justify-between gap-4 pt-4">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="border-blue-300"
                  >
                    Anterior
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={!isStep2Complete}
                    className="bg-blue-900 hover:bg-blue-800"
                  >
                    Próximo
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Descrição do Caso */}
          {step === 3 && (
            <Card className="border-2 border-blue-200">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-blue-900">Descrição do Caso</CardTitle>
                <CardDescription>Preencha os detalhes da sua ação</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Data do Fato</label>
                    <Input
                      placeholder="Ex: 15 de março de 2024"
                      value={formData.dataFato}
                      onChange={(e) => handleInputChange("dataFato", e.target.value)}
                      className="border-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Data da Tentativa de Solução</label>
                    <Input
                      placeholder="Ex: março de 2024"
                      value={formData.dataAtentativa}
                      onChange={(e) => handleInputChange("dataAtentativa", e.target.value)}
                      className="border-blue-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrição do Fato (primeira parte) *</label>
                  <Textarea
                    placeholder="Descreva o que ocorreu..."
                    value={formData.descricaoFato1}
                    onChange={(e) => handleInputChange("descricaoFato1", e.target.value)}
                    className="border-blue-300 min-h-24"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrição do Fato (segunda parte)</label>
                  <Textarea
                    placeholder="Continue descrevendo o caso..."
                    value={formData.descricaoFato2}
                    onChange={(e) => handleInputChange("descricaoFato2", e.target.value)}
                    className="border-blue-300 min-h-24"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrição do Fato (terceira parte)</label>
                  <Textarea
                    placeholder="Finalize a descrição..."
                    value={formData.descricaoFato3}
                    onChange={(e) => handleInputChange("descricaoFato3", e.target.value)}
                    className="border-blue-300 min-h-24"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meio de Tentativa de Solução</label>
                  <Input
                    placeholder="Ex: Contato telefônico, e-mail"
                    value={formData.meioAtentativa}
                    onChange={(e) => handleInputChange("meioAtentativa", e.target.value)}
                    className="border-blue-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resposta do Réu</label>
                  <Input
                    placeholder="Ex: Recusou-se a devolver o valor"
                    value={formData.respuestaReu}
                    onChange={(e) => handleInputChange("respuestaReu", e.target.value)}
                    className="border-blue-300"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Danos Materiais (R$) *</label>
                    <Input
                      placeholder="Ex: 1.500,00"
                      value={formData.danosMateriais}
                      onChange={(e) => handleInputChange("danosMateriais", e.target.value)}
                      className="border-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Danos Morais</label>
                    <Input
                      placeholder="Descreva os danos morais"
                      value={formData.danosMorais}
                      onChange={(e) => handleInputChange("danosMorais", e.target.value)}
                      className="border-blue-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Violação de Direito</label>
                  <Input
                    placeholder="Ex: Violação do direito do consumidor"
                    value={formData.violacaoDireito}
                    onChange={(e) => handleInputChange("violacaoDireito", e.target.value)}
                    className="border-blue-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Condenação Solicitada</label>
                  <Input
                    placeholder="Ex: Devolver a quantia integral"
                    value={formData.condenacao}
                    onChange={(e) => handleInputChange("condenacao", e.target.value)}
                    className="border-blue-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prova Apresentada</label>
                  <Input
                    placeholder="Ex: Contrato e comprovante de pagamento"
                    value={formData.prova}
                    onChange={(e) => handleInputChange("prova", e.target.value)}
                    className="border-blue-300"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tutela de Urgência</label>
                    <Input
                      placeholder="Ex: Bloqueie a conta"
                      value={formData.tutela}
                      onChange={(e) => handleInputChange("tutela", e.target.value)}
                      className="border-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Multa Diária (R$)</label>
                    <Input
                      placeholder="Ex: 100,00"
                      value={formData.tutelaMulta}
                      onChange={(e) => handleInputChange("tutelaMulta", e.target.value)}
                      className="border-blue-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Valor da Causa (R$) *</label>
                    <Input
                      placeholder="Ex: 3.000,00"
                      value={formData.valorCausa}
                      onChange={(e) => handleInputChange("valorCausa", e.target.value)}
                      className="border-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                    <Input
                      placeholder="Ex: São Paulo"
                      value={formData.cidade}
                      onChange={(e) => handleInputChange("cidade", e.target.value)}
                      className="border-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mês</label>
                    <Input
                      placeholder="Ex: março"
                      value={formData.mes}
                      onChange={(e) => handleInputChange("mes", e.target.value)}
                      className="border-blue-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ano</label>
                  <Input
                    placeholder="Ex: 2024"
                    value={formData.ano}
                    onChange={(e) => handleInputChange("ano", e.target.value)}
                    className="border-blue-300"
                  />
                </div>

                <div className="flex justify-between gap-4 pt-4">
                  <Button
                    onClick={() => setStep(2)}
                    variant="outline"
                    className="border-blue-300"
                  >
                    Anterior
                  </Button>
                  <Button
                    onClick={generatePDF}
                    disabled={!isStep3Complete}
                    className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Gerar PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Success Message */}
          {pdfGenerated && (
            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                  <div>
                    <h3 className="font-bold text-green-900">Petição gerada com sucesso!</h3>
                    <p className="text-green-800 text-sm">O arquivo PDF foi baixado. Você pode agora imprimir ou enviar para o juizado.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Dialog for select fields */}
      <Dialog open={Object.values(openDialogs).some(v => v)} onOpenChange={closeDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-blue-900">
              {currentDialogField === "autorNacionalidade" && "Selecione a Nacionalidade"}
              {currentDialogField === "autorEstadoCivil" && "Selecione o Estado Civil"}
              {currentDialogField === "acaoTipo" && "Selecione o Tipo de Ação"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {currentDialogField === "autorNacionalidade" &&
              NACIONALIDADES.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setTempValue(opt);
                    saveDialogValue();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-blue-100 rounded transition border border-gray-200"
                >
                  {opt}
                </button>
              ))}
            {currentDialogField === "autorEstadoCivil" &&
              ESTADOS_CIVIS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setTempValue(opt);
                    saveDialogValue();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-blue-100 rounded transition border border-gray-200"
                >
                  {opt}
                </button>
              ))}
            {currentDialogField === "acaoTipo" &&
              TIPOS_ACAO.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setTempValue(opt);
                    saveDialogValue();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-blue-100 rounded transition border border-gray-200"
                >
                  {opt}
                </button>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
