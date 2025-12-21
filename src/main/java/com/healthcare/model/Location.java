package com.healthcare.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.AccessLevel;

import java.util.List;

@Entity
@Table(name = "locations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Location {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Location type in hierarchy: PROVINCE, DISTRICT, SECTOR, CELL, VILLAGE
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private LocationType type;

    // Self-referencing parent location (null for provinces)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "parent_id")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Location parent;

    // Optional children collection for navigation (ignored in JSON to avoid recursion)
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Location> children;
    
    // Codes/Names are kept for compatibility; may be null at non-applicable levels.
    @Column(nullable = true)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Getter(AccessLevel.NONE)
    private String provinceCode;
    
    @Column(nullable = true)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Getter(AccessLevel.NONE)
    private String provinceName;
    
    @Column(nullable = true)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Getter(AccessLevel.NONE)
    private String districtCode;
    
    @Column(nullable = true)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Getter(AccessLevel.NONE)
    private String districtName;
    
    @Column(nullable = true)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Getter(AccessLevel.NONE)
    private String sectorCode;
    
    @Column(nullable = true)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Getter(AccessLevel.NONE)
    private String sectorName;
    
    @Column(nullable = true)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Getter(AccessLevel.NONE)
    private String cellCode;
    
    @Column(nullable = true)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Getter(AccessLevel.NONE)
    private String cellName;
    
    @Column(nullable = true)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Getter(AccessLevel.NONE)
    private String villageName;
    
    // One Location can have many Persons
    @OneToMany(mappedBy = "location", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Person> persons;
    
    // One Location can have many Hospitals
    @OneToMany(mappedBy = "location", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Hospital> hospitals;

    // -------- Derived getters to auto-resolve hierarchy via parent chain --------
    @JsonProperty(value = "provinceCode", access = JsonProperty.Access.READ_ONLY)
    public String getResolvedProvinceCode() {
        if (provinceCode != null) return provinceCode;
        return parent != null ? parent.getResolvedProvinceCode() : null;
    }

    @JsonProperty(value = "provinceName", access = JsonProperty.Access.READ_ONLY)
    public String getResolvedProvinceName() {
        if (provinceName != null) return provinceName;
        return parent != null ? parent.getResolvedProvinceName() : null;
    }

    @JsonProperty(value = "districtCode", access = JsonProperty.Access.READ_ONLY)
    public String getResolvedDistrictCode() {
        if (districtCode != null) return districtCode;
        return parent != null ? parent.getResolvedDistrictCode() : null;
    }

    @JsonProperty(value = "districtName", access = JsonProperty.Access.READ_ONLY)
    public String getResolvedDistrictName() {
        if (districtName != null) return districtName;
        return parent != null ? parent.getResolvedDistrictName() : null;
    }

    @JsonProperty(value = "sectorCode", access = JsonProperty.Access.READ_ONLY)
    public String getResolvedSectorCode() {
        if (sectorCode != null) return sectorCode;
        return parent != null ? parent.getResolvedSectorCode() : null;
    }

    @JsonProperty(value = "sectorName", access = JsonProperty.Access.READ_ONLY)
    public String getResolvedSectorName() {
        if (sectorName != null) return sectorName;
        return parent != null ? parent.getResolvedSectorName() : null;
    }

    @JsonProperty(value = "cellCode", access = JsonProperty.Access.READ_ONLY)
    public String getResolvedCellCode() {
        if (cellCode != null) return cellCode;
        return parent != null ? parent.getResolvedCellCode() : null;
    }

    @JsonProperty(value = "cellName", access = JsonProperty.Access.READ_ONLY)
    public String getResolvedCellName() {
        if (cellName != null) return cellName;
        return parent != null ? parent.getResolvedCellName() : null;
    }

    @JsonProperty(value = "villageName", access = JsonProperty.Access.READ_ONLY)
    public String getResolvedVillageName() {
        if (villageName != null) return villageName;
        return parent != null ? parent.getResolvedVillageName() : null;
    }

    // -------- Non-JSON getters for raw fields (used internally) --------
    @JsonIgnore public String getProvinceCode() { return provinceCode; }
    @JsonIgnore public String getProvinceName() { return provinceName; }
    @JsonIgnore public String getDistrictCode() { return districtCode; }
    @JsonIgnore public String getDistrictName() { return districtName; }
    @JsonIgnore public String getSectorCode() { return sectorCode; }
    @JsonIgnore public String getSectorName() { return sectorName; }
    @JsonIgnore public String getCellCode() { return cellCode; }
    @JsonIgnore public String getCellName() { return cellName; }
    @JsonIgnore public String getVillageName() { return villageName; }
}