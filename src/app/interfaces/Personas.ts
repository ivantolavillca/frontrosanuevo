
import { ActividadesFisicas } from "./ActividadesFisicas";
import { AntecedentesFamiliares } from "./AntecedentesFamiliares";
import { Clasificacion } from "./Clasificacion";
import { ComidaDiaria } from "./ComidaDiaria";
import { CondicionesMedicas } from "./CondicionesMedicas";
import { ConsumoComidaRapida } from "./ConsumoComidaRapida";
import { ConsumoMedicamentos } from "./ConsumoMedicamentos";
import { EstresAnsiedad } from "./EstresAnsiedad";
import { Genero } from "./Genero";
export interface Persona {
    id?:number,
    nombre_completo:string,
    edad:number,
    peso:number,
    estatura: number,
    genero?:Genero,
    clasificacion?:Clasificacion,
    antecedentes_familiares?:AntecedentesFamiliares,
    condiciones_medicas?:CondicionesMedicas,
    consumo_medicamentos?:ConsumoMedicamentos,
    estres_ansiedad?:EstresAnsiedad,
    actividades_fisicas?:ActividadesFisicas,
    comida_diaria?:ComidaDiaria,
    consumo_comida_rapida?:ConsumoComidaRapida,
    imc?:number,
}
