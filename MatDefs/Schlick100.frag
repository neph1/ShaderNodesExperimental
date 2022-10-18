void main(){
        //@input vec3 specular Specular color
    //@input vec3 normal Frag normal
    //@input vec3 lightDir Light direction
    //@output vec3 outColor The resulting color

    float NdotL = max( 0.0, dot( normal, lightDir ) );
    outColor = specular + ( 1.0 - specular ) * pow( ( 1.0 - NdotL ), 5.0 );
}